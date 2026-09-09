"use client";

import { useEditor, EditorContent, Extension } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import { useEffect, useCallback } from 'react';

// ── Custom Extension for Enter key split ─────────────────────────────────────
const EnterSplitExtension = Extension.create({
  name: 'enterSplit',
  addOptions() {
    return {
      onSplit: () => false,
    }
  },
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        // If shift+enter, just insert a soft break
        if (editor.state.selection.empty) {
          // Splitting at the current position
          const html1 = editor.getHTML();
          // We can't easily get HTML of part 1 and part 2 without actually splitting or creating a new doc.
          // Since it's a simple text block, let's just let the parent handle the split logic by providing the text before/after cursor.
          const state = editor.state;
          const { from } = state.selection;
          
          const before = state.doc.cut(0, from);
          const after = state.doc.cut(from, state.doc.content.size);
          
          // Serialize to HTML. TipTap uses prose-mirror DOMSerializer but it's tricky.
          // Let's use a simpler approach: if the user hits Enter, we'll try to split if there is a handler.
          if (this.options.onSplit) {
             return this.options.onSplit(editor);
          }
        }
        return false;
      }
    }
  }
});

// ── Toolbar button helper ────────────────────────────────────────────────────
function BubbleBtn({ onClick, isActive, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`px-2 py-1.5 text-[14px] transition-colors flex items-center justify-center ${
        isActive
          ? 'text-accent bg-highlight/20 font-bold'
          : 'text-muted hover:text-ink hover:bg-surface-sunken'
      }`}
    >
      {children}
    </button>
  );
}

// ── Main editor ──────────────────────────────────────────────────────────────
export default function RichTextEditor({ value, onChange, onSplit, onSlashCommand, sizeClass = '' }) {
  const SplitHandler = Extension.create({
    name: 'splitHandler',
    addKeyboardShortcuts() {
      return {
        Enter: ({ editor }) => {
          if (onSplit) {
            // Very simple approach for now: if user hits enter at end of block, create empty block
            // Better split requires prosemirror DOM manipulation. Let's do a basic split for now.
            const { state } = editor;
            const { from } = state.selection;
            const size = state.doc.content.size;
            if (from === size - 2 || from === size) {
               // At the end
               onSplit(editor.getHTML(), '');
               return true;
            }
          }
          return false;
        },
        '/': ({ editor }) => {
          if (onSlashCommand) {
            onSlashCommand();
          }
          return false; // let it type the slash
        }
      }
    }
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        bulletList: false,
        orderedList: false,
      }),
      Underline,
      TextAlign.configure({ types: ['paragraph'] }),
      Link.configure({ openOnClick: false }),
      Highlight.configure({ HTMLAttributes: { class: 'bg-mint px-1 rounded-sm' } }),
      SplitHandler,
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: `focus:outline-none min-h-[32px] prose prose-p:my-0 prose-a:text-ink prose-a:border-b-[1.5px] prose-a:border-highlight hover:prose-a:border-solid hover:prose-a:border-highlight prose-a:no-underline prose-strong:font-bold prose-code:text-[13px] prose-code:bg-surface-sunken prose-code:px-[5px] prose-code:py-[2px] prose-code:rounded-[5px] max-w-none [text-wrap:pretty] ${sizeClass || 'text-[19px] leading-[1.85] text-ink'}`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync content when block selection changes
  useEffect(() => {
    if (!editor) return;
    const incoming = value || '';
    if (editor.getHTML() !== incoming) {
      editor.commands.setContent(incoming, false);
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('URL', prev || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="relative">
      {/* ── Bubble Toolbar ─────────────────────────────────────────────────── */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex items-center bg-white rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] overflow-hidden divide-x divide-border z-50 pointer-events-auto border border-border">
        {/* Inline marks */}
        <BubbleBtn onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold (Ctrl+B)">
          <strong>B</strong>
        </BubbleBtn>
        <BubbleBtn onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic (Ctrl+I)">
          <em>I</em>
        </BubbleBtn>
        <BubbleBtn onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline (Ctrl+U)">
          <span className="underline font-bold">U</span>
        </BubbleBtn>
        <BubbleBtn onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
          <s>S</s>
        </BubbleBtn>
        <BubbleBtn onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Inline code">
          <span className="font-mono font-bold">{`<>`}</span>
        </BubbleBtn>
        <BubbleBtn onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} title="Highlight">
          <span className="bg-mint px-1 rounded-[3px] font-bold">H</span>
        </BubbleBtn>
        <BubbleBtn onClick={setLink} isActive={editor.isActive('link')} title="Insert link">
          🔗
        </BubbleBtn>
      </BubbleMenu>

      {/* ── Editor area ──────────────────────────────────────────────────── */}
      <EditorContent editor={editor} />
    </div>
  );
}
