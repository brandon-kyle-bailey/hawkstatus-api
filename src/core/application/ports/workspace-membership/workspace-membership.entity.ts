import { AggregateID } from '@app/common/ddd/entity.base';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export interface WorkspaceMembershipEntityProps {
  workspaceId: AggregateID;
  userId: AggregateID;
}

@Entity('workspacemembership')
export class WorkspaceMembershipRepositoryEntity {
  constructor(props: WorkspaceMembershipEntityProps) {
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
  workspaceId: AggregateID;

  @Column('uuid')
  userId: AggregateID;
}
