import { AggregateID } from '@app/common/ddd/entity.base';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export interface IntegrationEntityProps {
  ownerId: AggregateID;
  type: string;
  url?: string;
}

@Entity('integration')
export class IntegrationRepositoryEntity {
  constructor(props: IntegrationEntityProps) {
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
  type: string;

  @Column({ nullable: true })
  url?: string;
}
