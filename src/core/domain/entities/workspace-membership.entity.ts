import { v4 } from 'uuid';
import {
  DomainEvent,
  DomainEventProps,
} from '@app/common/ddd/domain-event.base';
import { AggregateID } from '@app/common/ddd/entity.base';
import { AggregateRoot } from '@app/common/ddd/aggregate-root.base';

export class WorkspaceMembershipCreatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<WorkspaceMembershipCreatedDomainEvent>) {
    super(props);
  }
}

export class WorkspaceMembershipDeletedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<WorkspaceMembershipDeletedDomainEvent>) {
    super(props);
  }
}

export class WorkspaceMembershipUpdatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<WorkspaceMembershipUpdatedDomainEvent>) {
    super(props);
  }
}

// All properties that an WorkspaceMembership has
export interface WorkspaceMembershipProps {
  workspaceId: AggregateID;
  userId: AggregateID;
}

// Properties that are needed for a WorkspaceMembership creation
export interface CreateWorkspaceMembershipProps
  extends WorkspaceMembershipProps {}

export interface UpdateWorkspaceMembershipProps
  extends Partial<CreateWorkspaceMembershipProps> {}

export class WorkspaceMembershipEntity extends AggregateRoot<WorkspaceMembershipProps> {
  protected readonly _id: AggregateID;

  static create(
    props: CreateWorkspaceMembershipProps,
    entityId?: string,
  ): WorkspaceMembershipEntity {
    const id = entityId || v4();
    const workspaceMembership = new WorkspaceMembershipEntity({ id, props });
    /* adding "WorkspaceMembershipCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    workspaceMembership.addEvent(
      new WorkspaceMembershipCreatedDomainEvent({
        aggregateId: id,
        ...workspaceMembership.getProps(),
      }),
    );
    return workspaceMembership;
  }

  update(props: UpdateWorkspaceMembershipProps): void {
    this.addEvent(
      new WorkspaceMembershipUpdatedDomainEvent({
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
      new WorkspaceMembershipDeletedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  /* Update method only changes properties that we allow, in this
   case only address. This prevents from illegal actions, 
   for example setting email from outside by doing something
   like WorkspaceMembership.email = otherEmail */

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
