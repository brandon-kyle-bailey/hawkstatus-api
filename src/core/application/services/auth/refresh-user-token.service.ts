import configuration from '@app/common/config/configuration';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UserTokenValueObject } from 'src/core/domain/value-objects/user-token.value-object';
import { RefreshUserTokenCommand } from 'src/interface/commands/user/refresh-user-token.command';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';

const {
  web: { secret, refresh_token_refresh },
} = configuration();

@CommandHandler(RefreshUserTokenCommand)
export class RefreshUserTokenService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    private readonly service: JwtService,
    @Inject(UserRepository)
    private readonly repo: UserRepositoryPort,
  ) {}
  async execute(
    command: RefreshUserTokenCommand,
  ): Promise<UserTokenValueObject> {
    try {
      const rawPayload = await this.service.verifyAsync(command.refresh_token, {
        secret,
      });
      const access_token = await this.service.signAsync({
        sub: rawPayload.sub,
        username: rawPayload.name,
        email: rawPayload.email,
      });

      const refresh_token = await this.service.signAsync(
        {
          sub: rawPayload.sub,
          username: rawPayload.name,
          email: rawPayload.email,
        },
        { expiresIn: refresh_token_refresh },
      );
      const user = await this.repo.findOneById(rawPayload.sub);
      const token = new UserTokenValueObject({
        access_token,
        refresh_token,
      });
      return token;
    } catch (error) {
      this.logger.error(
        'RefreshUserTokenService.execute encountered an error',
        error,
      );
    }
  }
}
