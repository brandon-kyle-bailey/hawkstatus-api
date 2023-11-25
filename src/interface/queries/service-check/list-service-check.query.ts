import { CommandProps } from '@app/common/ddd/command.base';
import { QueryBase } from '@app/common/ddd/query.base';

export class ListServiceCheckQuery extends QueryBase {
  private constructor(props: CommandProps<ListServiceCheckQuery>) {
    super();
  }

  static create(props: ListServiceCheckQuery): ListServiceCheckQuery {
    return new ListServiceCheckQuery(props);
  }
}
