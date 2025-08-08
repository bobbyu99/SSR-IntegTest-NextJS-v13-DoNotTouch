import { NextPage } from 'next'
import type { GetServerSidePropsContext } from 'next'

const HEADER_X_AMPLIFY_AUTHN_IDENTITY = 'x-amplify-authn-identity'

// TypeScript types matching the Rust OidcUserIdentity structure
enum SupportedAuthProviderType {
  GitHub = 'GitHub',
}

interface OidcUserIdentityAdditionalClaims {
  // Placeholder for additional claims
}

interface OidcUserIdentity {
  provider_type: SupportedAuthProviderType;
  provider_id: string;
  sub: string;
  iss: string;
  aud: string;
  email?: string;
  additional_claims?: OidcUserIdentityAdditionalClaims;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {

  // ⬇️ sleep 31s to trigger the HTTP client timeout
  const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
  await sleep(31_000);

  const { req } = context;

  const encodedIdentity = (req.headers[HEADER_X_AMPLIFY_AUTHN_IDENTITY] as string) || '<<missing>>';

  let decodedIdentity: OidcUserIdentity | null = null;
  
  if (encodedIdentity !== '<<missing>>') {
    try {
      const decodedString = Buffer.from(encodedIdentity, 'base64').toString('utf-8');
      decodedIdentity = JSON.parse(decodedString) as OidcUserIdentity;
      console.log('🔥 SSR - decoded OidcUserIdentity:', decodedIdentity);
    } catch (error) {
      console.error('🔥 SSR - failed to decode OidcUserIdentity:', error);
      decodedIdentity = null;
    }
  }

  return {
    props: {
      encodedIdentity,
      decodedIdentity,
    },
  };
}; 

const OmegaHello: NextPage<{ 
  encodedIdentity: string; 
  decodedIdentity: OidcUserIdentity | null;
}> = ({ encodedIdentity, decodedIdentity }) => (
  <div style={{ fontFamily: 'system-ui, sans-serif', padding: 20 }}>
    <h1>👋 Hello from /.omega/hello</h1>
    <p>This route is now served by Next as <code>/.omega/hello</code>.</p>
    <p>Encoded identity: {encodedIdentity}</p>
    {decodedIdentity ? (
      <div>
        <h3>Decoded OidcUserIdentity:</h3>
        <pre style={{ background: '#f5f5f5', padding: 10, borderRadius: 4, overflow: 'auto' }}>
          {JSON.stringify(decodedIdentity, null, 2)}
        </pre>
        <p><strong>Provider:</strong> {decodedIdentity.provider_type}</p>
        <p><strong>Provider ID:</strong> {decodedIdentity.provider_id}</p>
        <p><strong>Subject:</strong> {decodedIdentity.sub}</p>
        <p><strong>Issuer:</strong> {decodedIdentity.iss}</p>
        <p><strong>Audience:</strong> {decodedIdentity.aud}</p>
        {decodedIdentity.email && <p><strong>Email:</strong> {decodedIdentity.email}</p>}
      </div>
    ) : (
      <p>Failed to decode identity or identity is missing</p>
    )}
  </div>
)

export default OmegaHello