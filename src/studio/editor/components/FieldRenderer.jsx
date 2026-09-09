"use client";
import { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import MediaLibraryModal from './MediaLibraryModal';

function ImageFieldRenderer({ field, value, onChange }) {
  const { key, label, help } = field;
  const imageUrl = typeof value === 'string' ? value : (value?.url || '');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mb-6">
      <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">{label || key}</label>
      <div className="flex flex-col gap-2">
        <div 
          className="aspect-video bg-[#F2EFE8] border border-dashed border-border rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-forest"
          onClick={() => setIsModalOpen(true)}
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="preview" className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted group-hover:text-forest transition-colors">
              <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-medium">Click to select image</span>
            </div>
          )}
        </div>
        <input 
          type="text" 
          placeholder="Or paste an image URL..."
          value={imageUrl} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-[13px] rounded-lg border border-border focus:border-accent outline-none bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        />
      </div>
      {help && <p className="text-xs text-muted mt-2">{help}</p>}

      <MediaLibraryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(url) => onChange(url)}
      />
    </div>
  );
}

export default function FieldRenderer({ field, value, onChange }) {
  const { key, type, label, options, itemSchema, help, fields } = field;

  // Provide a safe fallback if value is undefined
  const val = value !== undefined ? value : '';

  switch (type) {
    case 'text':
      return (
        <div className="mb-6">
          <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">{label || key}</label>
          <input 
            type="text" 
            value={val} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-[13px] rounded-lg border border-border focus:border-accent outline-none bg-white transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          />
          {help && <p className="text-xs text-muted mt-2">{help}</p>}
        </div>
      );
    
    case 'textarea':
      return (
        <div className="mb-6">
          <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">{label || key}</label>
          <textarea 
            value={val} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-[13px] rounded-lg border border-border focus:border-accent outline-none bg-white transition-colors resize-y min-h-[100px] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          />
          {help && <p className="text-xs text-muted mt-2">{help}</p>}
        </div>
      );

    case 'select':
      return (
        <div className="mb-6">
          <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">{label || key}</label>
          <select 
            value={val} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-[13px] rounded-lg border border-border focus:border-accent outline-none bg-white transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <option value="" disabled>Select an option...</option>
            {options?.map((opt, i) => {
              const optValue = opt.value !== undefined ? opt.value : opt;
              const optLabel = opt.label !== undefined ? opt.label : opt;
              return <option key={optValue === '' ? `empty-${i}` : optValue} value={optValue}>{optLabel}</option>
            })}
          </select>
          {help && <p className="text-xs text-muted mt-2">{help}</p>}
        </div>
      );

    case 'toggleGroup':
      return (
        <div className="mb-6">
          <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">{label || key}</label>
          <div className="bg-[#F2EFE8] rounded-full p-1 flex">
            {options?.map(opt => {
              const optValue = opt.value !== undefined ? opt.value : opt;
              const optLabel = opt.label !== undefined ? opt.label : opt;
              // Fix: coerce both sides to string so number 2 === string "2"
              const isSelected = String(val) === String(optValue);
              return (
                <button
                  key={String(optValue)}
                  onClick={() => onChange(optValue)}
                  className={`flex-1 min-w-0 px-2 py-1.5 rounded-full text-[13px] font-semibold transition-all capitalize truncate ${isSelected ? 'bg-white text-ink shadow-[0_1px_3px_rgba(0,0,0,0.05)]' : 'text-muted hover:text-ink'}`}
                >
                  {optLabel}
                </button>
              );
            })}
          </div>
          {help && <p className="text-xs text-muted mt-2">{help}</p>}
        </div>
      );

    case 'boolean':
      return (
        <div className="flex items-center justify-between mb-4 group">
          <label className="text-[13px] font-medium text-ink cursor-pointer flex-1" onClick={() => onChange(!val)}>
            {label || key}
          </label>
          <button 
            type="button"
            onClick={() => onChange(!val)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus:outline-none ${val ? 'bg-[#3C5B49]' : 'bg-[#E5EAD7]'}`}
          >
            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${val ? 'translate-x-2' : '-translate-x-2'}`} />
          </button>
        </div>
      );

    case 'group':
      return (
        <div className="mb-6 pt-4 border-t border-border">
          <h4 className="text-xs font-bold text-ink mb-4">{label || key}</h4>
          <div>
            {fields?.map(subField => (
              <FieldRenderer 
                key={subField.key} 
                field={subField} 
                value={value?.[subField.key]} 
                onChange={(newVal) => onChange({ ...value, [subField.key]: newVal })}
              />
            ))}
          </div>
        </div>
      );
    
    case 'richtext':
      return (
        <div className="mb-6">
          <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">{label || key}</label>
          <div className="border border-border rounded-lg overflow-hidden bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <RichTextEditor value={val} onChange={onChange} />
          </div>
          {help && <p className="text-xs text-muted mt-2">{help}</p>}
        </div>
      );

    case 'image':
      return <ImageFieldRenderer field={field} value={value} onChange={onChange} />;

    case 'cardReference':
      return (
        <div className="mb-6">
          <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">{label || key}</label>
          <select 
            value={val} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-[13px] rounded-lg border border-border focus:border-accent outline-none bg-white transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <option value="" disabled>Choose a product card...</option>
            <option value="card-1">Chase Sapphire Reserve</option>
            <option value="card-2">Amex Platinum</option>
          </select>
          {help && <p className="text-xs text-muted mt-2">{help}</p>}
        </div>
      );

    case 'repeatable':
      const items = Array.isArray(value) ? value : [];
      return (
        <div className="mb-6 p-4 border border-border rounded-lg bg-[#F2EFE8]">
          <label className="block text-sm font-bold text-ink mb-3">{label || key}</label>
          <div className="space-y-4">
            {items.map((item, index) => {
              const itemKey = item?._id || `item-${index}`;
              return (
              <div key={itemKey} className="relative p-4 border border-border bg-white rounded-[14px] shadow-sm">
                <button 
                  onClick={() => {
                    const newItems = [...items];
                    newItems.splice(index, 1);
                    onChange(newItems);
                  }}
                  className="absolute top-3 right-3 text-muted hover:text-warn-ink transition-colors bg-white rounded-full p-1"
                  title="Remove item"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="text-[10px] font-bold text-muted mb-4 uppercase tracking-wider">Item {index + 1}</div>
                {itemSchema?.map(subField => (
                  <FieldRenderer 
                    key={subField.key} 
                    field={subField} 
                    value={item[subField.key]}
                    onChange={(newVal) => {
                      const newItems = [...items];
                      newItems[index] = { ...item, [subField.key]: newVal };
                      onChange(newItems);
                    }}
                  />
                ))}
              </div>
              );
            })}
          </div>
          <button 
            onClick={() => onChange([...items, { _id: crypto.randomUUID() }])}
            className="mt-4 w-full py-2 bg-white border border-border rounded-lg text-[13px] font-semibold text-ink hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add {label || 'Item'}
          </button>
        </div>
      );

    case 'number':
      return (
        <div className="mb-6">
          <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">{label || key}</label>
          <input 
            type="number" 
            value={val === '' ? '' : Number(val)} 
            onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-3 py-2 text-[13px] rounded-lg border border-border focus:border-accent outline-none bg-white transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          />
          {help && <p className="text-xs text-muted mt-2">{help}</p>}
        </div>
      );

    default:
      return <div className="text-warn-ink text-sm mb-4">Unsupported field type: {type}</div>;
  }
}
