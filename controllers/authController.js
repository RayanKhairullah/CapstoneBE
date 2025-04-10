const { User } = require('../models');
const Bcrypt = require('bcrypt');
const { sendEmail } = require('../utils/email');
const Jwt = require('jsonwebtoken');
const Boom = require('@hapi/boom');
const { nanoid } = require('nanoid');

const registerHandler = async (request, h) => {
    const { username, email, password } = request.payload;
  
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return h.response({
          status: 'fail',
          message: 'Email sudah terdaftar',
        }).code(400);
      }
  
      const hashedPassword = await Bcrypt.hash(password, 10);
      const verificationCode = nanoid(10);
  
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        verificationCode,
      });
  
      try {
        await sendEmail(email, 'Verifikasi Email Kamu - NeuroFin', `Halo! Terima kasih sudah mendaftar di NeuroFin. Kode verifikasi kamu adalah: ${verificationCode}`);
      } catch (emailError) {
        console.error('Error sending email:', emailError.message);
        return h.response({
          status: 'fail',
          message: 'Gagal mengirim email verifikasi',
        }).code(500);
      }
  
      return h.response({
        status: 'success',
        message: 'Registrasi berhasil, cek email untuk verifikasi',
      }).code(201);
    } catch (error) {
      console.error('Error during registration:', error.message);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      }).code(500);
    }
};

const verifyEmailHandler = async (request, h) => {
    const { email, code } = request.payload;
  
    try {
      console.log('Email dari request:', email);
      console.log('Kode verifikasi dari request:', code);
  
      const user = await User.findOne({ where: { email } });
      console.log('Data pengguna dari database:', user);
  
      if (!user) {
        return h.response({
          status: 'fail',
          message: 'Email tidak ditemukan',
        }).code(404);
      }
  
      if (user.verificationCode !== code) {
        return h.response({
          status: 'fail',
          message: 'Kode verifikasi tidak valid',
        }).code(400);
      }
  
      user.verified = true;
      await user.save();
  
      return h.response({
        status: 'success',
        message: 'Email berhasil diverifikasi',
      }).code(200);
    } catch (error) {
      console.error('Error during email verification:', error.message);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      }).code(500);
    }
};

const loginHandler = async (request, h) => {
  const { email, password } = request.payload;

  const user = await User.findOne({ where: { email } });
  if (!user || !(await Bcrypt.compare(password, user.password))) {
    throw Boom.unauthorized('Email atau kata sandi tidak valid');
  }

  if (!user.verified) {
    throw Boom.forbidden('Harap verifikasi email Anda terlebih dahulu');
  }

  const token = Jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { algorithm: 'HS256', expiresIn: '4h' }
  );

  return h.response({
    status: 'success',
    message: 'Login berhasil',
    data: { token },
  }).code(200);
};

module.exports = { registerHandler, verifyEmailHandler, loginHandler };