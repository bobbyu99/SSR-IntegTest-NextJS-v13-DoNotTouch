// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // read the identity header that Compute Origin stamped on the request
  const identity = req.headers['x-authn-identity'] || '<<missing>>'
  console.log('🔥 propagated identity token:', identity)
  
  res.status(200).json({ name: 'John Doe' })
}
