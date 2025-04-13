const { Server } = require('@hapi/hapi');
const routes = require('../routes/expenseRoutes');
const authRoutes = require('../routes/authRoutes');
const prisma = require('../utils/prisma');
const errorHandler = require('../middlewares/errorHandler');

let cachedServer;

module.exports = async (req, res) => {
  if (!cachedServer) {
    const server = new Server({
      port: process.env.PORT,
      host: '0.0.0.0',
    });

    server.route([...authRoutes, ...routes]);

    server.ext('onPreResponse', (request, h) => {
      const response = request.response;
      if (response.isBoom) {
        return errorHandler(response, h);
      }
      return h.continue;
    });

    await prisma.$connect();
    await server.initialize(); // instead of server.start()

    cachedServer = server;
  }

  const { req: hapiReq, res: hapiRes } = await cachedServer.inject({
    method: req.method,
    url: req.url,
    headers: req.headers,
    payload: req.body,
  });

  res.statusCode = hapiRes.statusCode;
  for (const [key, value] of Object.entries(hapiRes.headers)) {
    res.setHeader(key, value);
  }

  res.end(hapiRes.rawPayload || '');
};
