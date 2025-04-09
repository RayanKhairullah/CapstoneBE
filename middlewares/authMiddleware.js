const Jwt = require('@hapi/jwt');
const Boom = require('@hapi/boom');

const authMiddleware = (request, h) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw Boom.unauthorized('Token tidak ditemukan');
  }
  const token = authHeader.split(' ')[1];
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  console.log('Token:', token);

  try {
    const decoded = Jwt.token.verify(token, process.env.JWT_SECRET);
    request.auth = { user: decoded.decoded.payload };
    return h.continue;
  } catch (error) {
    console.error('Error verifying token:', error.message);
    throw Boom.unauthorized('Token tidak valid');
  }
};

module.exports = authMiddleware;