import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export interface UserEntityProps {
  readonly name: string;
  readonly email: string;
  readonly verified: boolean;
  readonly password: string;
}

@Entity('user')
export class UserRepositoryEntity {
  constructor(props: UserEntityProps) {
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

  @Column({ length: 500 })
  name: string;

  @Column()
  email: string;

  @Column({ default: false })
  verified: boolean;

  @Column()
  password: string;
}
