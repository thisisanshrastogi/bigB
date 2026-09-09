import StudioShell from '@/studio/shell/StudioShell';

export const metadata = {
  title: 'Blog Studio | Amalgamic',
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioLayout({ children }) {
  // In a real app we'd have a server-side auth check here or in middleware
  // and redirect if unauthenticated. Middleware handles it right now.
  return (
    <StudioShell>
      {children}
    </StudioShell>
  );
}
