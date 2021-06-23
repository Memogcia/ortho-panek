import { createProxyMiddleware } from "http-proxy-middleware";
import express from "express";
import { getAccessToken } from "@auth0/nextjs-auth0";

const app = express();

app.use("*", async (req, res, next) => {
  const { accessToken } = await getAccessToken(req, res);

  return createProxyMiddleware({
    target: process.env.GRAPHQL_URL,
    changeOrigin: true,
    proxyTimeout: 5000,
    secure: false,
    headers: {
      Connection: "keep-alive",
    },
    pathRewrite: {
      "^/api/graphql": "",
    },
    onError: (err, _, resp) => {
      console.log("err", err, res.data);
      resp.writeHead(500, {
        "Content-Type": "text/plain",
      });
      resp.end("Something went wrong. Please try again later.");
    },
    onProxyReq: async (proxyReq, request, _) => {
      if (accessToken) {
        proxyReq.setHeader("Authorization", `Bearer ${accessToken}`);
      }

      if (request.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.setHeader("x-hasura-admin-secret", process.env.HASURA_SECRET);
        // stream the content
        proxyReq.write(bodyData);
      }
    },
  })(req, res, next);
});

export default app;
