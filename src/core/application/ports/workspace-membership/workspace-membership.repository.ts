import { Injectable, Logger } from '@nestjs/common';
import { WorkspaceMembershipRepositoryPort } from './workspace-membership.repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceMembershipRepositoryEntity } from './workspace-membership.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  PaginatedQueryParams,
  Paginated,
} from '@app/common/ports/repository.port';
import { WorkspaceMembershipEntity } from 'src/core/domain/entities/workspace-membership.entity';
import { WorkspaceMembershipMapper } from 'src/infrastructure/mappers/workspace-membership.mapper';

@Injectable()
export class WorkspaceMembershipRepository
  implements WorkspaceMembershipRepositoryPort
{
  constructor(
    @InjectRepository(WorkspaceMembershipRepositoryEntity)
    protected readonly repo: Repository<WorkspaceMembershipRepositoryEntity>,
    protected readonly mapper: WorkspaceMembershipMapper,
    protected readonly logger: Logger,
    private eventEmitter: EventEmitter2,
  ) {}
  async findOneBy(filter: any): Promise<WorkspaceMembershipEntity> {
    const result = await this.repo.findOne({
      where: filter,
    });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async save(entity: WorkspaceMembershipEntity): Promise<void> {
    await this.repo.save(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async insert(entity: WorkspaceMembershipEntity): Promise<void> {
    const result = await this.repo.insert(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async findOneById(id: string): Promise<WorkspaceMembershipEntity> {
    const result = await this.repo.findOne({
      where: { id },
    });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async findAll(): Promise<WorkspaceMembershipEntity[]> {
    const result = await this.repo.find();
    if (!result) {
      return [];
    }
    return result.map((record) => this.mapper.toDomain(record));
  }
  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<WorkspaceMembershipEntity>> {
    const result = await this.repo.find({
      skip: params.offset,
      take: params.limit,
      order: { [String(params.orderBy.field)]: params.orderBy.param },
    });
    if (!result) {
      return null;
    }
    return new Paginated({
      count: result.length,
      limit: Number(params.limit),
      page: params.page,
      data: result.map((record) => this.mapper.toDomain(record)),
    });
  }
  async delete(entity: WorkspaceMembershipEntity): Promise<boolean> {
    const result = await this.repo.softDelete(entity.id);
    if (result) {
      await entity.publishEvents(this.logger, this.eventEmitter);
      return true;
    }
    return false;
  }
  async transaction<T>(handler: () => Promise<T>): Promise<T> {
    return await handler();
  }
}
