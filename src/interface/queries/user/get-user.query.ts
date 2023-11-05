import { CommandProps } from '@app/common/ddd/command.base';
import { QueryBase } from '@app/common/ddd/query.base';

export class GetUserQuery extends QueryBase {
  readonly id: string;

  private constructor(props: CommandProps<GetUserQuery>) {
    super();
    this.id = props.id;
  }

  static create(props: GetUserQuery): GetUserQuery {
    return new GetUserQuery(props);
  }
}
