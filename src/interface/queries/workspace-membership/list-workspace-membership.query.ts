import { CommandProps } from '@app/common/ddd/command.base';
import { QueryBase } from '@app/common/ddd/query.base';

export class ListWorkspaceMembershipQuery extends QueryBase {
  private constructor(props: CommandProps<ListWorkspaceMembershipQuery>) {
    super();
  }

  static create(
    props: ListWorkspaceMembershipQuery,
  ): ListWorkspaceMembershipQuery {
    return new ListWorkspaceMembershipQuery(props);
  }
}
