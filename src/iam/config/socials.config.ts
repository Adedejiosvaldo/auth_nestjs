import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  };
});
