import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';
import { AggregateID } from '@app/common/ddd/entity.base';
import { DeleteUserCommand } from 'src/interface/commands/user/delete-user.command';

@CommandHandler(DeleteUserCommand)
export class DeleteUserService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(UserRepository)
    protected readonly repo: UserRepositoryPort,
  ) {}
  async execute(command: DeleteUserCommand): Promise<AggregateID> {
    try {
      await this.repo.transaction(async () => {
        const User = await this.repo.findOneById(command.id);
        User.delete();
        await this.repo.delete(User);
      });
      return command.id;
    } catch (error) {
      this.logger.error(
        'DeleteUserService.execute encountered an error',
        error,
      );
    }
  }
}
