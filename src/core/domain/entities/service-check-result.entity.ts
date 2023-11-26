import { v4 } from 'uuid';
import {
  DomainEvent,
  DomainEventProps,
} from '@app/common/ddd/domain-event.base';
import { AggregateID } from '@app/common/ddd/entity.base';
import { AggregateRoot } from '@app/common/ddd/aggregate-root.base';

export class ServiceCheckResultCreatedDomainEvent extends DomainEvent {
  readonly serviceCheckId: AggregateID;
  readonly status: number;
  readonly duration: number;
  readonly response: string;
  constructor(props: DomainEventProps<ServiceCheckResultCreatedDomainEvent>) {
    super(props);
    this.serviceCheckId = props.serviceCheckId;
    this.status = props.status;
    this.duration = props.duration;
    this.response = props.response;
  }
}

export class ServiceCheckResultDeletedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<ServiceCheckResultDeletedDomainEvent>) {
    super(props);
  }
}

export class ServiceCheckResultUpdatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<ServiceCheckResultUpdatedDomainEvent>) {
    super(props);
  }
}

// All properties that an ServiceCheckResult has
export interface ServiceCheckResultProps {
  serviceCheckId: AggregateID;
  status: number;
  duration: number;
  response: string;
  incidentId?: AggregateID;
}

// Properties that are needed for a ServiceCheckResult creation
export interface CreateServiceCheckResultProps
  extends ServiceCheckResultProps {}

export interface UpdateServiceCheckResultProps
  extends Partial<CreateServiceCheckResultProps> {}

export class ServiceCheckResultEntity extends AggregateRoot<ServiceCheckResultProps> {
  protected readonly _id: AggregateID;

  static create(
    props: CreateServiceCheckResultProps,
    entityId?: string,
  ): ServiceCheckResultEntity {
    const id = entityId || v4();
    const serviceCheckResult = new ServiceCheckResultEntity({ id, props });
    /* adding "ServiceCheckResultCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    serviceCheckResult.addEvent(
      new ServiceCheckResultCreatedDomainEvent({
        aggregateId: id,
        ...serviceCheckResult.getProps(),
      }),
    );
    return serviceCheckResult;
  }

  get incidentId() {
    return this.props.incidentId;
  }

  setIncidentId(incidentId: AggregateID) {
    this.props.incidentId = incidentId;
  }

  update(props: UpdateServiceCheckResultProps): void {
    if (props.incidentId) {
      this.setIncidentId(props.incidentId);
    }
    this.addEvent(
      new ServiceCheckResultUpdatedDomainEvent({
        aggregateId: this.id,
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
      new ServiceCheckResultDeletedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  /* Update method only changes properties that we allow, in this
   case only address. This prevents from illegal actions, 
   for example setting email from outside by doing something
   like ServiceCheckResult.email = otherEmail */

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
