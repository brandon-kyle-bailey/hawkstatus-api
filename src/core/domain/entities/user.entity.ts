import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import {
  DomainEvent,
  DomainEventProps,
} from '@app/common/ddd/domain-event.base';
import { AggregateID } from '@app/common/ddd/entity.base';
import { AggregateRoot } from '@app/common/ddd/aggregate-root.base';
import { UserTokenValueObject } from '../value-objects/user-token.value-object';

export class UserCreatedDomainEvent extends DomainEvent {
  readonly userId: AggregateID;
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly password: string;
  constructor(props: DomainEventProps<UserCreatedDomainEvent>) {
    super(props);
    this.userId = props.userId;
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
    this.password = props.password;
  }
}

export class UserDeletedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<UserDeletedDomainEvent>) {
    super(props);
  }
}

export class UserUpdatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<UserUpdatedDomainEvent>) {
    super(props);
  }
}

// All properties that an User has
export interface UserProps {
  name: string;
  email: string;
  phone?: string;
  verified: boolean;
  password: string;
  token?: UserTokenValueObject;
}

// Properties that are needed for a User creation
export interface CreateUserProps extends UserProps {}

export interface UpdateUserProps extends Partial<CreateUserProps> {}

export class UserEntity extends AggregateRoot<UserProps> {
  protected readonly _id: AggregateID;

  static create(props: CreateUserProps, entityId?: string): UserEntity {
    const id = entityId || v4();
    const password = bcrypt.hashSync(props.password, 10);
    const user = new UserEntity({ id, props: { ...props, password } });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    user.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: id,
        ...user.getProps(),
        userId: id,
      }),
    );
    return user;
  }

  setToken(token: UserTokenValueObject) {
    this.props.token = token;
  }

  get email() {
    return this.props.email;
  }

  get name() {
    return this.props.name;
  }

  update(props: UpdateUserProps): void {
    if (props.verified) {
      this.setIsVerified(props.verified);
    }

    this.addEvent(
      new UserUpdatedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  setIsVerified(value: boolean): void {
    this.props.verified = value;
  }

  /* You can create getters only for the properties that you need to
  access and leave the rest of the properties private to keep entity
  encapsulated. To get all entity properties (for saving it to a
  database or mapping a response) use .getProps() method
  defined in a EntityBase parent class */

  delete(): void {
    this.addEvent(
      new UserDeletedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  verifyPasswordHash(password: string): boolean {
    return bcrypt.compareSync(password, this.props.password);
  }

  /* Update method only changes properties that we allow, in this
   case only address. This prevents from illegal actions, 
   for example setting email from outside by doing something
   like user.email = otherEmail */

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
