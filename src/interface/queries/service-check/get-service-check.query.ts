import { CommandProps } from '@app/common/ddd/command.base';
import { QueryBase } from '@app/common/ddd/query.base';

export class GetServiceCheckQuery extends QueryBase {
  readonly id: string;

  private constructor(props: CommandProps<GetServiceCheckQuery>) {
    super();
    this.id = props.id!;
  }

  static create(props: GetServiceCheckQuery): GetServiceCheckQuery {
    return new GetServiceCheckQuery(props);
  }
}
