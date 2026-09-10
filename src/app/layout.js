import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata = {
  title: "Amalgamic Blog",
  description: "One home for every credit card",
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-96.png', sizes: '96x96', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-180.png', sizes: '180x180', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-16-dark.png', sizes: '16x16', type: 'image/png', media: '(prefers-color-scheme: dark)' },
      { url: '/favicon-32-dark.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: dark)' },
      { url: '/favicon-48-dark.png', sizes: '48x48', type: 'image/png', media: '(prefers-color-scheme: dark)' },
      { url: '/favicon-96-dark.png', sizes: '96x96', type: 'image/png', media: '(prefers-color-scheme: dark)' },
      { url: '/favicon-180-dark.png', sizes: '180x180', type: 'image/png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ]
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${lora.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
