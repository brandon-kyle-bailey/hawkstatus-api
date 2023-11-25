import { AggregateID } from '@app/common/ddd/entity.base';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export interface WorkspaceEntityProps {
  ownerId: AggregateID;
  name: string;
}

@Entity('workspace')
export class WorkspaceRepositoryEntity {
  constructor(props: WorkspaceEntityProps) {
    Object.assign(this, props);
  }
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column('uuid')
  ownerId: AggregateID;

  @Column()
  name: string;
}
