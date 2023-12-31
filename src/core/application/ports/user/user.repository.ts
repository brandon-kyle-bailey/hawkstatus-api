import { Injectable, Logger } from '@nestjs/common';
import { UserRepositoryPort } from './user.repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepositoryEntity } from './user.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  PaginatedQueryParams,
  Paginated,
} from '@app/common/ports/repository.port';
import { UserEntity } from 'src/core/domain/entities/user.entity';
import { UserMapper } from 'src/infrastructure/mappers/user.mapper';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserRepositoryEntity)
    protected readonly repo: Repository<UserRepositoryEntity>,
    protected readonly mapper: UserMapper,
    protected readonly logger: Logger,
    private eventEmitter: EventEmitter2,
  ) {}

  async findOneBy(filter: any): Promise<UserEntity> {
    const result = await this.repo.findOne({
      where: filter,
    });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async findOneByEmail(email: string): Promise<UserEntity> {
    const result = await this.repo.findOne({
      where: { email },
    });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async save(entity: UserEntity): Promise<void> {
    await this.repo.save(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async insert(entity: UserEntity): Promise<void> {
    const result = await this.repo.insert(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async findOneById(id: string): Promise<UserEntity> {
    const result = await this.repo.findOne({
      where: { id },
    });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async findAll(): Promise<UserEntity[]> {
    const result = await this.repo.find();
    if (!result) {
      return [];
    }
    return result.map((record) => this.mapper.toDomain(record));
  }
  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<UserEntity>> {
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
  async delete(entity: UserEntity): Promise<boolean> {
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
