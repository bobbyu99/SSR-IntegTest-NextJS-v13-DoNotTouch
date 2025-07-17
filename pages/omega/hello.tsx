// pages/omega/hello.tsx
import { NextPage } from 'next'
import type { GetServerSidePropsContext } from 'next'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context; // Access the incoming request object

  // Access specific headers using req.headers
  const identity = (req.headers['x-omega-authn-identity'] as string) || '<<missing>>'; // Identity token from Compute Origin

  console.log('🔥 SSR - propagated identity token:', identity);

  // You can then use these headers in your page logic or pass them as props
  return {
    props: {
      identity,
    },
  };
}; 

const OmegaHello: NextPage = () => (
  <div style={{ fontFamily: 'system-ui, sans-serif', padding: 20 }}>
    <h1>👋 Hello from /.omega/hello</h1>
    <p>This route is now served by Next as <code>/.omega/hello</code>.</p>
  </div>
)

export default OmegaHello