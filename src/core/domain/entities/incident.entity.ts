import { v4 } from 'uuid';
import {
  DomainEvent,
  DomainEventProps,
} from '@app/common/ddd/domain-event.base';
import { AggregateID } from '@app/common/ddd/entity.base';
import { AggregateRoot } from '@app/common/ddd/aggregate-root.base';

export class IncidentCreatedDomainEvent extends DomainEvent {
  serviceCheckId: AggregateID;
  status: string;
  createdAt: Date;
  constructor(props: DomainEventProps<IncidentCreatedDomainEvent>) {
    super(props);
    this.serviceCheckId = props.serviceCheckId;
    this.status = props.status;
    this.createdAt = props.createdAt;
  }
}

export class IncidentDeletedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<IncidentDeletedDomainEvent>) {
    super(props);
  }
}

export class IncidentUpdatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<IncidentUpdatedDomainEvent>) {
    super(props);
  }
}

// All properties that an Incident has
export interface IncidentProps {
  serviceCheckId: AggregateID;
  status: string;
}

// Properties that are needed for a Incident creation
export interface CreateIncidentProps extends IncidentProps {}

export interface UpdateIncidentProps extends Partial<CreateIncidentProps> {}

export class IncidentEntity extends AggregateRoot<IncidentProps> {
  protected readonly _id: AggregateID;

  static create(props: CreateIncidentProps, entityId?: string): IncidentEntity {
    const id = entityId || v4();
    const incident = new IncidentEntity({ id, props });
    /* adding "IncidentCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    incident.addEvent(
      new IncidentCreatedDomainEvent({
        aggregateId: id,
        ...incident.getProps(),
      }),
    );
    return incident;
  }

  update(props: UpdateIncidentProps): void {
    this.addEvent(
      new IncidentUpdatedDomainEvent({
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
      new IncidentDeletedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  /* Update method only changes properties that we allow, in this
   case only address. This prevents from illegal actions, 
   for example setting email from outside by doing something
   like Incident.email = otherEmail */

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
