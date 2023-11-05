import { RepositoryPort } from '@app/common/ports/repository.port';
import { UserEntity } from 'src/core/domain/entities/user.entity';

export interface UserRepositoryPort extends RepositoryPort<UserEntity> {
  findOneByEmail(email: string): Promise<UserEntity>;
}
