import { v4 } from 'uuid';
import {
  DomainEvent,
  DomainEventProps,
} from '@app/common/ddd/domain-event.base';
import { AggregateID } from '@app/common/ddd/entity.base';
import { AggregateRoot } from '@app/common/ddd/aggregate-root.base';

export class IntegrationCreatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<IntegrationCreatedDomainEvent>) {
    super(props);
  }
}

export class IntegrationDeletedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<IntegrationDeletedDomainEvent>) {
    super(props);
  }
}

export class IntegrationUpdatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<IntegrationUpdatedDomainEvent>) {
    super(props);
  }
}

// All properties that an Integration has
export interface IntegrationProps {
  ownerId: AggregateID;
  type: string;
  url?: string;
}

// Properties that are needed for a Integration creation
export interface CreateIntegrationProps extends IntegrationProps {}

export interface UpdateIntegrationProps
  extends Partial<CreateIntegrationProps> {}

export class IntegrationEntity extends AggregateRoot<IntegrationProps> {
  protected readonly _id: AggregateID;

  static create(
    props: CreateIntegrationProps,
    entityId?: string,
  ): IntegrationEntity {
    const id = entityId || v4();
    const integration = new IntegrationEntity({ id, props });
    /* adding "IntegrationCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    integration.addEvent(
      new IntegrationCreatedDomainEvent({
        aggregateId: id,
        ...integration.getProps(),
      }),
    );
    return integration;
  }

  update(props: UpdateIntegrationProps): void {
    this.addEvent(
      new IntegrationUpdatedDomainEvent({
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
      new IntegrationDeletedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  /* Update method only changes properties that we allow, in this
   case only address. This prevents from illegal actions, 
   for example setting email from outside by doing something
   like Integration.email = otherEmail */

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
