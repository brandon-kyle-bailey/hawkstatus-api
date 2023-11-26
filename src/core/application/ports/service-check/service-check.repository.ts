import { Injectable, Logger } from '@nestjs/common';
import { ServiceCheckRepositoryPort } from './service-check.repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceCheckRepositoryEntity } from './service-check.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  PaginatedQueryParams,
  Paginated,
} from '@app/common/ports/repository.port';
import {
  ScheduleStatus,
  ServiceCheckEntity,
} from 'src/core/domain/entities/service-check.entity';
import { ServiceCheckMapper } from 'src/infrastructure/mappers/servce-check.mapper';

@Injectable()
export class ServiceCheckRepository implements ServiceCheckRepositoryPort {
  constructor(
    @InjectRepository(ServiceCheckRepositoryEntity)
    protected readonly repo: Repository<ServiceCheckRepositoryEntity>,
    protected readonly mapper: ServiceCheckMapper,
    protected readonly logger: Logger,
    private eventEmitter: EventEmitter2,
  ) {}

  async findOneBy(filter: any): Promise<ServiceCheckEntity> {
    const result = await this.repo.findOne({
      where: filter,
    });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }

  async findAllByStatus(status: ScheduleStatus): Promise<ServiceCheckEntity[]> {
    const result = await this.repo.findBy({ status: status.toString() });
    return result.map((record) => this.mapper.toDomain(record));
  }

  async save(entity: ServiceCheckEntity): Promise<void> {
    await this.repo.save(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async insert(entity: ServiceCheckEntity): Promise<void> {
    const result = await this.repo.insert(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async findOneById(id: string): Promise<ServiceCheckEntity> {
    const result = await this.repo.findOne({
      where: { id },
    });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async findAll(): Promise<ServiceCheckEntity[]> {
    const result = await this.repo.find();
    if (!result) {
      return [];
    }
    return result.map((record) => this.mapper.toDomain(record));
  }
  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<ServiceCheckEntity>> {
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
  async delete(entity: ServiceCheckEntity): Promise<boolean> {
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
