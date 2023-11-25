import { CommandProps } from '@app/common/ddd/command.base';
import { QueryBase } from '@app/common/ddd/query.base';

export class ListServiceCheckResultQuery extends QueryBase {
  private constructor(props: CommandProps<ListServiceCheckResultQuery>) {
    super();
  }

  static create(
    props: ListServiceCheckResultQuery,
  ): ListServiceCheckResultQuery {
    return new ListServiceCheckResultQuery(props);
  }
}
