import { ArgumentInvalidException } from '@app/common/exceptions/exceptions';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity } from 'src/core/domain/entities/user.entity';
import { CreateUserCommand } from 'src/interface/commands/user/create-user.command';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(UserRepository)
    protected readonly repo: UserRepositoryPort,
  ) {}
  async execute(command: CreateUserCommand): Promise<UserEntity> {
    try {
      const existingUser = await this.repo.findOneByEmail(command.email);
      if (existingUser) {
        throw new ArgumentInvalidException('user already exists');
      }
      const user = UserEntity.create({
        name: command.name,
        email: command.email,
        phone: command.phone,
        password: command.password,
        verified: false,
      });
      await this.repo.transaction(async () => {
        this.repo.insert(user);
      });
      return user;
    } catch (error) {
      this.logger.error(
        'CreateUserService.execute encountered an error',
        error,
      );
    }
  }
}
