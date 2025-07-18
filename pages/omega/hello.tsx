import { NextPage } from 'next'
import type { GetServerSidePropsContext } from 'next'

const HEADER_X_AMPLIFY_AUTHN_IDENTITY = 'x-amplify-authn-identity'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;

  const identity = (req.headers[HEADER_X_AMPLIFY_AUTHN_IDENTITY] as string) || '<<missing>>';

  console.log('🔥 SSR - propagated identity token:', identity);
  
  return {
    props: {
      identity,
    },
  };
}; 

const OmegaHello: NextPage<{ identity: string }> = ({ identity }) => (
  <div style={{ fontFamily: 'system-ui, sans-serif', padding: 20 }}>
    <h1>👋 Hello from /.omega/hello</h1>
    <p>This route is now served by Next as <code>/.omega/hello</code>.</p>
    <p>Identity token: {identity}</p>
  </div>
)

export default OmegaHello