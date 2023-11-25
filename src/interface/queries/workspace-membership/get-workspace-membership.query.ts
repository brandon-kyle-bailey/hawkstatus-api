import { CommandProps } from '@app/common/ddd/command.base';
import { QueryBase } from '@app/common/ddd/query.base';

export class GetWorkspaceMembershipQuery extends QueryBase {
  readonly id: string;

  private constructor(props: CommandProps<GetWorkspaceMembershipQuery>) {
    super();
    this.id = props.id!;
  }

  static create(
    props: GetWorkspaceMembershipQuery,
  ): GetWorkspaceMembershipQuery {
    return new GetWorkspaceMembershipQuery(props);
  }
}
