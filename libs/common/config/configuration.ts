import * as dotenv from 'dotenv';
dotenv.config();

export default () => ({
  environment: process.env.NODE_ENV,
  web: {
    port: parseInt(process.env.PORT!, 10),
    secret: process.env.ACCESS_TOKEN_SECRET,
    access_token_refresh: process.env.ACCESS_TOKEN_REFRESH,
    refresh_token_refresh: process.env.REFRESH_TOKEN_REFRESH,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT!, 10),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    default_from: process.env.SMTP_DEFAULT_FROM,
  },
  ses: {
    host: process.env.SES_HOST,
    port: parseInt(process.env.SES_PORT!, 10),
    user: process.env.SES_USER,
    password: process.env.SES_PASSWORD,
  },
  database: {
    postgres: {
      driver: process.env.DATABASE_DRIVER,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT!, 10),
      name: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    },
  },
});
