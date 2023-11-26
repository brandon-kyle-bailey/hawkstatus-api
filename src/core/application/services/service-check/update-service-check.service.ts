import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ScheduleMethod,
  ScheduleStatus,
  ScheduleType,
  ServiceCheckEntity,
} from 'src/core/domain/entities/service-check.entity';
import { ServiceCheckRepository } from '../../ports/service-check/service-check.repository';
import { ServiceCheckRepositoryPort } from '../../ports/service-check/service-check.repository.port';
import { UpdateServiceCheckCommand } from 'src/interface/commands/service-check/update-service-check.command';

@CommandHandler(UpdateServiceCheckCommand)
export class UpdateServiceCheckService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ServiceCheckRepository)
    protected readonly repo: ServiceCheckRepositoryPort,
  ) {}
  async execute(
    command: UpdateServiceCheckCommand,
  ): Promise<ServiceCheckEntity> {
    try {
      let serviceCheck: ServiceCheckEntity;
      await this.repo.transaction(async () => {
        serviceCheck = await this.repo.findOneById(command.serviceCheckId);
        if (command.status === ScheduleStatus.ACTIVE) {
          serviceCheck.schedule();
        }
        if (command.status === ScheduleStatus.INACTIVE) {
          serviceCheck.unSchedule();
        }
        serviceCheck.update({
          ...command,
          type: command.type as ScheduleType,
          status: command.status as ScheduleStatus,
          method: command.method as ScheduleMethod,
        });
        this.repo.save(serviceCheck);
      });
      return serviceCheck;
    } catch (error) {
      this.logger.error(
        'UpdateServiceCheckService.execute encountered an error',
        error,
      );
    }
  }
}
