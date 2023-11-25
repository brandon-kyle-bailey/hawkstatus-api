import { CommandProps } from '@app/common/ddd/command.base';
import { QueryBase } from '@app/common/ddd/query.base';

export class ListWorkspaceQuery extends QueryBase {
  private constructor(props: CommandProps<ListWorkspaceQuery>) {
    super();
  }

  static create(props: ListWorkspaceQuery): ListWorkspaceQuery {
    return new ListWorkspaceQuery(props);
  }
}
