import configuration from '@app/common/config/configuration';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UserTokenPayloadValueObject } from 'src/core/domain/value-objects/user-token-payload.value-object';
import { VerifyUserTokenCommand } from 'src/interface/commands/user/verify-user-token.command';

const {
  web: { secret },
} = configuration();

@CommandHandler(VerifyUserTokenCommand)
export class VerifyUserTokenService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    private readonly service: JwtService,
  ) {}
  async execute(
    command: VerifyUserTokenCommand,
  ): Promise<UserTokenPayloadValueObject> {
    this.logger.debug(`VerifyUserTokenService.execute called with`, command);
    try {
      const rawPayload = await this.service.verifyAsync(command.access_token, {
        secret,
      });
      const payload = new UserTokenPayloadValueObject({
        sub: rawPayload.sub,
        username: rawPayload.username,
        email: rawPayload.email,
      });
      return payload;
    } catch (error) {
      this.logger.error(
        'VerifyUserTokenService.execute encountered an error',
        error,
      );
    }
  }
}
