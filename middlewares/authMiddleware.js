const Jwt = require('@hapi/jwt');
const Boom = require('@hapi/boom');

const authMiddleware = (request, h) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw Boom.unauthorized('Token tidak ditemukan');
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = Jwt.token.verify(token, process.env.JWT_SECRET);
    request.auth = { user: decoded.decoded.payload };
    return h.continue;
  } catch (error) {
    throw Boom.unauthorized('Token tidak valid');
  }
};

module.exports = authMiddleware;
