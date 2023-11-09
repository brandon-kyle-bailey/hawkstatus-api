import configuration from '@app/common/config/configuration';
import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

const envConfig = configuration();

export const config: MailerOptions = {
  transport: {
    host:
      envConfig.environment === 'development'
        ? envConfig.smtp.host
        : envConfig.ses.host,
    port:
      envConfig.environment === 'development'
        ? envConfig.smtp.port
        : envConfig.ses.port,
    secure: false,
    auth: {
      user:
        envConfig.environment === 'development'
          ? envConfig.smtp.user
          : envConfig.ses.user,
      pass:
        envConfig.environment === 'development'
          ? envConfig.smtp.password
          : envConfig.ses.password,
    },
  },
  defaults: {
    from: envConfig.smtp.default_from,
  },
  template: {
    dir: join(__dirname, 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};

export const adapters = [
  {
    provide: 'smtp',
    useFactory: async () => {
      return config;
    },
  },
];
