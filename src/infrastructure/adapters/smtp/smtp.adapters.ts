import configuration from '@app/common/config/configuration';
import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

const {
  smtp: { host, port, user, password, default_from },
} = configuration();

export const config: MailerOptions = {
  transport: {
    host,
    port,
    secure: false,
    auth: {
      user,
      pass: password,
    },
  },
  defaults: {
    from: default_from,
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
