import dotenv from 'dotenv';

dotenv.config();

const env = {
  aocSessionCookie: process.env.AOC_SESSION_COOKIE,
};

if (!env.aocSessionCookie || env.aocSessionCookie.trim() === '') {
  throw new Error('AOC_SESSION_COOKIE is not set');
}

export default env;
