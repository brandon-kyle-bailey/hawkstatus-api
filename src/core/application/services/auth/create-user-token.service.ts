import configuration from '@app/common/config/configuration';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UserTokenValueObject } from 'src/core/domain/value-objects/user-token.value-object';
import { CreateUserTokenCommand } from 'src/interface/commands/user/create-user-token.command';

const {
  web: { refresh_token_refresh },
} = configuration();

@CommandHandler(CreateUserTokenCommand)
export class CreateUserTokenService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    private readonly service: JwtService,
  ) {}
  async execute(
    command: CreateUserTokenCommand,
  ): Promise<UserTokenValueObject> {
    try {
      const access_token = await this.service.signAsync({
        sub: command.id,
        username: command.name,
        email: command.email,
      });

      const refresh_token = await this.service.signAsync(
        {
          sub: command.id,
          username: command.name,
          email: command.email,
        },
        { expiresIn: refresh_token_refresh },
      );
      const token = new UserTokenValueObject({
        access_token,
        refresh_token,
      });
      return token;
    } catch (error) {
      this.logger.error(
        'CreateUserTokenService.execute encountered an error',
        error,
      );
    }
  }
}
