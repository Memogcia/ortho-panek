import proxy from 'http-proxy-middleware';
import express from 'express';

// https://github.com/auth0/nextjs-auth0/issues/67#issuecomment-581599845

const app = express();

app.use('*', async (req, _, next) => {
  const { accessToken } = await getAccessToken(req, res);

  const wsProxy = proxy({
    target: process.env.GRAPHQL_URL,
    changeOrigin: true,
    logLevel: 'debug',
    ws: true,
    timeout: 30000,
    proxyTimeout: 30000,
    pathRewrite: {
      '^/api/graphql-ws': ''
    },
    onProxyReqWs: proxyReq => {
      if (accessToken) {
        proxyReq.setHeader('Authorization', `Bearer ${accessToken}`);
      }
      proxyReq.setHeader('x-hasura-admin-secret', process.env.HASURA_SECRET);
    }
  });

  app.on('upgrade', wsProxy.upgrade);

  return wsProxy(req, _, next);
});

export default app; `