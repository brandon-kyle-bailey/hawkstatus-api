import { CommandProps } from '@app/common/ddd/command.base';
import { QueryBase } from '@app/common/ddd/query.base';

export class ListIncidentQuery extends QueryBase {
  readonly serviceCheckId: string;
  private constructor(props: CommandProps<ListIncidentQuery>) {
    super();
    this.serviceCheckId = props.serviceCheckId;
  }

  static create(props: ListIncidentQuery): ListIncidentQuery {
    return new ListIncidentQuery(props);
  }
}
