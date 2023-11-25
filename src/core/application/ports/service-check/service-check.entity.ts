import { AggregateID } from '@app/common/ddd/entity.base';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export interface ServiceCheckEntityProps {
  ownerId: AggregateID;
  name: string;
  url: string;
  interval: number;
  timeout: number;
  alertCheckThreshold: number;
  method: string;
  body: string;
  headers: string;
  status: string;
  type: string;
}

@Entity('servicecheck')
export class ServiceCheckRepositoryEntity {
  constructor(props: ServiceCheckEntityProps) {
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

  @Column()
  url: string;

  @Column()
  interval: number;

  @Column()
  timeout: number;

  @Column()
  alertCheckThreshold: number;

  @Column()
  method: string;

  @Column()
  body: string;

  @Column()
  headers: string;

  @Column()
  status: string;

  @Column()
  type: string;
}
