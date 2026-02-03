import '../styles/globals.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthProvider } from '@/lib/auth';
import Layout from '@/components/Layout';

// Pages that don't need the authenticated layout
const PUBLIC_PAGES = ['/login', '/register'];

function AppContent({ Component, pageProps }) {
  const router = useRouter();
  const isPublicPage = PUBLIC_PAGES.includes(router.pathname);

  // Public pages render without layout
  if (isPublicPage) {
    return <Component {...pageProps} />;
  }

  // Authenticated pages get the full layout
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>TrueBeam Queue Management</title>
        <meta name="description" content="Smart queue management system for radiation therapy" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏥</text></svg>" />
      </Head>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}
