import { CommandProps } from '@app/common/ddd/command.base';
import { QueryBase } from '@app/common/ddd/query.base';

export class ListIncidentQuery extends QueryBase {
  private constructor(props: CommandProps<ListIncidentQuery>) {
    super();
  }

  static create(props: ListIncidentQuery): ListIncidentQuery {
    return new ListIncidentQuery(props);
  }
}
