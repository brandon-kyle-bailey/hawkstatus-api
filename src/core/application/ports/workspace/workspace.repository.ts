import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  PaginatedQueryParams,
  Paginated,
} from '@app/common/ports/repository.port';
import { WorkspaceEntity } from 'src/core/domain/entities/workspace.entity';
import { WorkspaceMapper } from 'src/infrastructure/mappers/workspace.mapper';
import { WorkspaceRepositoryEntity } from './workspace.entity';
import { WorkspaceRepositoryPort } from './workspace.repository.port';

@Injectable()
export class WorkspaceRepository implements WorkspaceRepositoryPort {
  constructor(
    @InjectRepository(WorkspaceRepositoryEntity)
    protected readonly repo: Repository<WorkspaceRepositoryEntity>,
    protected readonly mapper: WorkspaceMapper,
    protected readonly logger: Logger,
    private eventEmitter: EventEmitter2,
  ) {}
  async findOneBy(filter: any): Promise<WorkspaceEntity> {
    const result = await this.repo.findOne({
      where: filter,
    });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async save(entity: WorkspaceEntity): Promise<void> {
    await this.repo.save(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async insert(entity: WorkspaceEntity): Promise<void> {
    const result = await this.repo.insert(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async findOneById(id: string): Promise<WorkspaceEntity> {
    const result = await this.repo.findOne({
      where: { id },
    });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async findAll(): Promise<WorkspaceEntity[]> {
    const result = await this.repo.find();
    if (!result) {
      return [];
    }
    return result.map((record) => this.mapper.toDomain(record));
  }
  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<WorkspaceEntity>> {
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
  async delete(entity: WorkspaceEntity): Promise<boolean> {
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
