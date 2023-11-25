import { CommandProps } from '@app/common/ddd/command.base';
import { QueryBase } from '@app/common/ddd/query.base';

export class ListIntegrationQuery extends QueryBase {
  private constructor(props: CommandProps<ListIntegrationQuery>) {
    super();
  }

  static create(props: ListIntegrationQuery): ListIntegrationQuery {
    return new ListIntegrationQuery(props);
  }
}
