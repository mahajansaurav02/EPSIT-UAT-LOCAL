const { legacyCreateProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // Proxy for API1 (NIC)
  app.use(
    "/api1",
    legacyCreateProxyMiddleware({
      target: "http://115.124.110.13/PCISMASTERMS/api", // Backend 1
      changeOrigin: true,
      pathRewrite: { "^/api1": "" }, // Remove the `/api1` prefix
    })
  );
  // Proxy for API2 (Gauri)
  app.use(
    "/api2",
    legacyCreateProxyMiddleware({
      target: "http://192.168.1.36:90/api", // Backend 2
      changeOrigin: true,
      pathRewrite: { "^/api2": "" }, // Remove the `/api2` prefix
    })
  );

  // Proxy for API3 (Mrunal)
  // app.use(
  //   "/api3",
  //   legacyCreateProxyMiddleware({
  //     target: "http://192.168.1.52:90/api", // Backend 3
  //     changeOrigin: true,
  //     pathRewrite: { "^/api3": "" }, // Remove the `/api3` prefix
  //   })
  // );
};

//Gauri Proxy:- "http://192.168.1.36:90/api",
//Mrunal Proxy:- "http://192.168.1.52:90/api",
