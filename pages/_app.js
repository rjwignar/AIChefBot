import '@/styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '@/components/Layout';
import { SessionProvider } from 'next-auth/react';
import 'animate.css';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </>
  )
}
