import { AggregateID } from '@app/common/ddd/entity.base';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export interface ServiceCheckResultEntityProps {
  serviceCheckId: AggregateID;
  status: number;
  duration: number;
  response: string;
  incidentId?: AggregateID;
}

@Entity('servicecheckresult')
export class ServiceCheckResultRepositoryEntity {
  constructor(props: ServiceCheckResultEntityProps) {
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
  serviceCheckId: AggregateID;

  @Column('uuid', { nullable: true })
  incidentId: AggregateID;

  @Column()
  status: number;

  @Column()
  duration: number;

  @Column()
  response: string;
}
