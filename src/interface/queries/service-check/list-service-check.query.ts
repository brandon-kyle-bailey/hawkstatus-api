import { CommandProps } from '@app/common/ddd/command.base';
import { QueryBase } from '@app/common/ddd/query.base';

export class ListServiceCheckQuery extends QueryBase {
  readonly ownerId: string;
  private constructor(props: CommandProps<ListServiceCheckQuery>) {
    super();
    this.ownerId = props.ownerId!;
  }

  static create(props: ListServiceCheckQuery): ListServiceCheckQuery {
    return new ListServiceCheckQuery(props);
  }
}
