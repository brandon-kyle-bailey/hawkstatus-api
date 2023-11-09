import configuration from '@app/common/config/configuration';
import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

const config = configuration();

export const emailConfig: MailerOptions = {
  transport: {
    host:
      config.environment === 'development' ? config.smtp.host : config.ses.host,
    port:
      config.environment === 'development' ? config.smtp.port : config.ses.port,
    secure: false,
    auth: {
      user:
        config.environment === 'development'
          ? config.smtp.user
          : config.ses.user,
      pass:
        config.environment === 'development'
          ? config.smtp.password
          : config.ses.password,
    },
  },
  defaults: {
    from: config.smtp.default_from,
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
      return emailConfig;
    },
  },
];
