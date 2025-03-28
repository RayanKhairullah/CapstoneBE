const Hapi = require('@hapi/hapi');
const routes = require('../routes/expenseRoutes');
const { sequelize } = require('../models');
const errorHandler = require('../middlewares/errorHandler');
const config = require('../config/config');

const init = async () => {
  const server = Hapi.server({
    port: config.port,
    host: 'localhost',
  });

  server.route(routes);

  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (response.isBoom) {
      return errorHandler(response, h);
    }
    return h.continue;
  });

  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

init();