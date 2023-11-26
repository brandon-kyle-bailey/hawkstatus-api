import { v4 } from 'uuid';
import {
  DomainEvent,
  DomainEventProps,
} from '@app/common/ddd/domain-event.base';
import { AggregateID } from '@app/common/ddd/entity.base';
import { AggregateRoot } from '@app/common/ddd/aggregate-root.base';

export enum ScheduleType {
  Cron = 'cron',
  Timeout = 'timeout',
  Interval = 'interval',
}

export enum ScheduleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ScheduleMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
}

export class UnScheduleServiceCheckDomainEvent extends DomainEvent {
  readonly serviceCheckId: AggregateID;
  readonly type: ScheduleType;
  constructor(props: DomainEventProps<UnScheduleServiceCheckDomainEvent>) {
    super(props);
    this.serviceCheckId = props.serviceCheckId;
    this.type = props.type;
  }
}

export class ExecuteScheduleServiceCheckDomainEvent extends DomainEvent {
  readonly serviceCheckId: AggregateID;
  readonly url: string;
  readonly timeout: number;
  readonly alertCheckThreshold: number;
  readonly method: string;
  readonly body: string;
  readonly headers: { [key: string]: any };
  constructor(props: DomainEventProps<ExecuteScheduleServiceCheckDomainEvent>) {
    super(props);
    this.serviceCheckId = props.serviceCheckId;
    this.url = props.url;
    this.timeout = props.timeout;
    this.alertCheckThreshold = props.alertCheckThreshold;
    this.method = props.method;
    this.body = props.body;
    this.headers = props.headers;
  }
}

export class ExecuteScheduleServiceCheckCompleteDomainEvent extends DomainEvent {
  readonly serviceCheckId: AggregateID;
  readonly status: number;
  readonly duration: number;
  readonly response: string;
  readonly alertCheckThreshold: number;
  constructor(
    props: DomainEventProps<ExecuteScheduleServiceCheckCompleteDomainEvent>,
  ) {
    super(props);
    this.serviceCheckId = props.serviceCheckId;
    this.status = props.status;
    this.duration = props.duration;
    this.response = props.response;
    this.alertCheckThreshold = props.alertCheckThreshold;
  }
}

export class ScheduleServiceCheckDomainEvent extends DomainEvent {
  readonly ownerId: AggregateID;
  readonly name: string;
  readonly serviceCheckId: AggregateID;
  readonly url: string;
  readonly interval: number;
  readonly timeout: number;
  readonly alertCheckThreshold: number;
  readonly method: string;
  readonly body: string;
  readonly headers: { [key: string]: any };
  readonly status: string;
  readonly type: string;
  constructor(props: DomainEventProps<ScheduleServiceCheckDomainEvent>) {
    super(props);
    this.ownerId = props.ownerId;
    this.name = props.name;
    this.serviceCheckId = props.serviceCheckId;
    this.url = props.url;
    this.interval = props.interval;
    this.timeout = props.timeout;
    this.alertCheckThreshold = props.alertCheckThreshold;
    this.method = props.method;
    this.body = props.body;
    this.headers = props.headers;
    this.status = props.status;
    this.type = props.type;
  }
}

export class ServiceCheckCreatedDomainEvent extends DomainEvent {
  readonly ownerId: AggregateID;
  readonly name: string;
  readonly url: string;
  readonly interval: number;
  readonly timeout: number;
  readonly alertCheckThreshold: number;
  readonly method: string;
  readonly body: string;
  readonly headers: { [key: string]: any };
  readonly status: string;
  readonly type: string;
  constructor(props: DomainEventProps<ServiceCheckCreatedDomainEvent>) {
    super(props);
    this.ownerId = props.ownerId;
    this.name = props.name;
    this.url = props.url;
    this.interval = props.interval;
    this.timeout = props.timeout;
    this.alertCheckThreshold = props.alertCheckThreshold;
    this.method = props.method;
    this.body = props.body;
    this.headers = props.headers;
    this.status = props.status;
    this.type = props.type;
  }
}

export class ServiceCheckDeletedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<ServiceCheckDeletedDomainEvent>) {
    super(props);
  }
}

export class ServiceCheckUpdatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<ServiceCheckUpdatedDomainEvent>) {
    super(props);
  }
}

// All properties that an ServiceCheck has
export interface ServiceCheckProps {
  ownerId: AggregateID;
  name: string;
  url: string;
  interval: number;
  timeout: number;
  alertCheckThreshold: number;
  method: ScheduleMethod;
  body: string;
  headers: { [key: string]: any };
  status: ScheduleStatus;
  type: ScheduleType;
}

// Properties that are needed for a ServiceCheck creation
export interface CreateServiceCheckProps extends ServiceCheckProps {}

export interface UpdateServiceCheckProps
  extends Partial<CreateServiceCheckProps> {}

export class ServiceCheckEntity extends AggregateRoot<ServiceCheckProps> {
  protected readonly _id: AggregateID;

  static create(
    props: CreateServiceCheckProps,
    entityId?: string,
  ): ServiceCheckEntity {
    const id = entityId || v4();
    const serviceCheck = new ServiceCheckEntity({ id, props });
    /* adding "ServiceCheckCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    serviceCheck.addEvent(
      new ServiceCheckCreatedDomainEvent({
        aggregateId: id,
        ...serviceCheck.getProps(),
      }),
    );
    return serviceCheck;
  }

  get ownerId() {
    return this.props.ownerId;
  }
  get name() {
    return this.props.name;
  }
  get url() {
    return this.props.url;
  }
  get interval() {
    return this.props.interval;
  }
  get timeout() {
    return this.props.timeout;
  }
  get alertCheckThreshold() {
    return this.props.alertCheckThreshold;
  }
  get method() {
    return this.props.method;
  }
  get body() {
    return this.props.body;
  }
  get headers() {
    return this.props.headers;
  }
  get status() {
    return this.props.status;
  }
  get type() {
    return this.props.type;
  }

  updateStatus(status: ScheduleStatus) {
    this.props.status = status;
  }

  update(props: UpdateServiceCheckProps): void {
    if (props.status) {
      this.updateStatus(props.status);
    }
    this.setUpdatedAt(new Date());
    this.addEvent(
      new ServiceCheckUpdatedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  execute(): void {
    this.addEvent(
      new ExecuteScheduleServiceCheckDomainEvent({
        aggregateId: this.id,
        serviceCheckId: this.id,
        ...this.getProps(),
      }),
    );
  }

  schedule(): void {
    this.addEvent(
      new ScheduleServiceCheckDomainEvent({
        aggregateId: this.id,
        serviceCheckId: this.id,
        ...this.getProps(),
      }),
    );
  }

  unSchedule(): void {
    this.addEvent(
      new UnScheduleServiceCheckDomainEvent({
        aggregateId: this.id,
        serviceCheckId: this.id,
        type: this.type,
      }),
    );
  }

  /* You can create getters only for the properties that you need to
  access and leave the rest of the properties private to keep entity
  encapsulated. To get all entity properties (for saving it to a
  database or mapping a response) use .getProps() method
  defined in a EntityBase parent class */

  delete(): void {
    this.addEvent(
      new ServiceCheckDeletedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  /* Update method only changes properties that we allow, in this
   case only address. This prevents from illegal actions, 
   for example setting email from outside by doing something
   like ServiceCheck.email = otherEmail */

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
