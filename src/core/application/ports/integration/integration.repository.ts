import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  PaginatedQueryParams,
  Paginated,
} from '@app/common/ports/repository.port';
import { IntegrationEntity } from 'src/core/domain/entities/integration.entity';
import { IntegrationMapper } from 'src/infrastructure/mappers/integration.mapper';
import { IntegrationRepositoryEntity } from './integration.entity';
import { IntegrationRepositoryPort } from './integration.repository.port';

@Injectable()
export class IntegrationRepository implements IntegrationRepositoryPort {
  constructor(
    @InjectRepository(IntegrationRepositoryEntity)
    protected readonly repo: Repository<IntegrationRepositoryEntity>,
    protected readonly mapper: IntegrationMapper,
    protected readonly logger: Logger,
    private eventEmitter: EventEmitter2,
  ) {}

  async save(entity: IntegrationEntity): Promise<void> {
    await this.repo.save(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async insert(entity: IntegrationEntity): Promise<void> {
    const result = await this.repo.insert(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async findOneById(id: string): Promise<IntegrationEntity> {
    const result = await this.repo.findOne({
      where: { id },
    });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async findAll(): Promise<IntegrationEntity[]> {
    const result = await this.repo.find();
    if (!result) {
      return [];
    }
    return result.map((record) => this.mapper.toDomain(record));
  }
  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<IntegrationEntity>> {
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
  async delete(entity: IntegrationEntity): Promise<boolean> {
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
