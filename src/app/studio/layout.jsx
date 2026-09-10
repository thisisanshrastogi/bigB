import StudioShell from '@/studio/shell/StudioShell';
import { auth } from '@/lib/auth';

export const metadata = {
  title: 'Blog Studio | Amalgamic',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function StudioLayout({ children }) {
  const session = await auth();
  
  return (
    <StudioShell user={session?.user}>
      {children}
    </StudioShell>
  );
}
