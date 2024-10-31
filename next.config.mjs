/** @type {import('next').NextConfig} */
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://*.tile.openstreetmap.org;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
  connect-src 'self' https://firebase.googleapis.com https://www.googleapis.com https://*.firebasedatabase.app https://www.google-analytics.com
    wss://*.firebasedatabase.app;
  script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://*.firebasedatabase.app;
  frame-src https://*.firebasedatabase.app;
`;

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          }
        ]
      }
    ];
  }
};

export default nextConfig;
