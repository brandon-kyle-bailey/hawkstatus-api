import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  PaginatedQueryParams,
  Paginated,
} from '@app/common/ports/repository.port';
import { IncidentRepositoryEntity } from './incident.entity';
import { IncidentRepositoryPort } from './incident.repository.port';
import { IncidentMapper } from 'src/infrastructure/mappers/incident.mapper';
import { IncidentEntity } from 'src/core/domain/entities/incident.entity';

@Injectable()
export class IncidentRepository implements IncidentRepositoryPort {
  constructor(
    @InjectRepository(IncidentRepositoryEntity)
    protected readonly repo: Repository<IncidentRepositoryEntity>,
    protected readonly mapper: IncidentMapper,
    protected readonly logger: Logger,
    private eventEmitter: EventEmitter2,
  ) {}

  async save(entity: IncidentEntity): Promise<void> {
    await this.repo.save(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async insert(entity: IncidentEntity): Promise<void> {
    await this.repo.insert(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async findOneById(id: string): Promise<IncidentEntity> {
    const result = await this.repo.findOne({
      where: { id },
    });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async findOneBy(filter: any): Promise<IncidentEntity> {
    const result = await this.repo.findOne({
      where: filter,
    });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async findAll(): Promise<IncidentEntity[]> {
    const result = await this.repo.find();
    if (!result) {
      return [];
    }
    return result.map((record) => this.mapper.toDomain(record));
  }
  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<IncidentEntity>> {
    const result = await this.repo.find({
      skip: params.offset,
      take: params.limit,
      where: params.filter,
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
  async delete(entity: IncidentEntity): Promise<boolean> {
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
