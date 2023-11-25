import { AggregateID } from '@app/common/ddd/entity.base';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export interface IncidentEntityProps {
  serviceCheckId: AggregateID;
  status: string;
}

@Entity('incident')
export class IncidentRepositoryEntity {
  constructor(props: IncidentEntityProps) {
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

  @Column()
  status: string;
}
