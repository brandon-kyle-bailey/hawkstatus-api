import { v4 } from 'uuid';
import {
  DomainEvent,
  DomainEventProps,
} from '@app/common/ddd/domain-event.base';
import { AggregateID } from '@app/common/ddd/entity.base';
import { AggregateRoot } from '@app/common/ddd/aggregate-root.base';

export class WorkspaceCreatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<WorkspaceCreatedDomainEvent>) {
    super(props);
  }
}

export class WorkspaceDeletedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<WorkspaceDeletedDomainEvent>) {
    super(props);
  }
}

export class WorkspaceUpdatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<WorkspaceUpdatedDomainEvent>) {
    super(props);
  }
}

// All properties that an Workspace has
export interface WorkspaceProps {
  ownerId: AggregateID;
  name: string;
}

// Properties that are needed for a Workspace creation
export interface CreateWorkspaceProps extends WorkspaceProps {}

export interface UpdateWorkspaceProps extends Partial<CreateWorkspaceProps> {}

export class WorkspaceEntity extends AggregateRoot<WorkspaceProps> {
  protected readonly _id: AggregateID;

  static create(
    props: CreateWorkspaceProps,
    entityId?: string,
  ): WorkspaceEntity {
    const id = entityId || v4();
    const workspace = new WorkspaceEntity({ id, props });
    /* adding "WorkspaceCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    workspace.addEvent(
      new WorkspaceCreatedDomainEvent({
        aggregateId: id,
        ...workspace.getProps(),
      }),
    );
    return workspace;
  }

  update(props: UpdateWorkspaceProps): void {
    this.addEvent(
      new WorkspaceUpdatedDomainEvent({
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
      new WorkspaceDeletedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  /* Update method only changes properties that we allow, in this
   case only address. This prevents from illegal actions, 
   for example setting email from outside by doing something
   like Workspace.email = otherEmail */

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
