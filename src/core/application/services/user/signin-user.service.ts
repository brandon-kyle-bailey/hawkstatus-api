import {
  Inject,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';
import { SigninUserCommand } from 'src/interface/commands/user/signin-user.command';
import { UserTokenValueObject } from 'src/core/domain/value-objects/user-token.value-object';
import { CreateUserTokenCommand } from 'src/interface/commands/user/create-user-token.command';

@CommandHandler(SigninUserCommand)
export class SigninUserService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(UserRepository)
    private readonly repo: UserRepositoryPort,
    private readonly commandBus: CommandBus,
  ) {}
  async execute(command: SigninUserCommand): Promise<UserEntity> {
    try {
      const user = await this.repo.findOneByEmail(command.email);
      if (!user) {
        throw new NotFoundException('user not found');
      }
      const { id, name, email, password, verified } = user.getProps();
      if (!verified) {
        throw new UnauthorizedException('Email address has not been verified');
      }
      if (!user.verifyPasswordHash(command.password)) {
        throw new UnauthorizedException('credentials invalid');
      }
      const payload = {
        id,
        name,
        email,
        password,
      };
      const token: UserTokenValueObject = await this.commandBus.execute(
        CreateUserTokenCommand.create(payload),
      );
      user.setToken(token);
      return user;
    } catch (error) {
      this.logger.error(
        'SigninUserService.execute encountered an error',
        error,
      );
    }
  }
}
