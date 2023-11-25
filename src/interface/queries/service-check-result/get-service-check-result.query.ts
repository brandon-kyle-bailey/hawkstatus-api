import { CommandProps } from '@app/common/ddd/command.base';
import { QueryBase } from '@app/common/ddd/query.base';

export class GetServiceCheckResultQuery extends QueryBase {
  readonly id: string;

  private constructor(props: CommandProps<GetServiceCheckResultQuery>) {
    super();
    this.id = props.id!;
  }

  static create(props: GetServiceCheckResultQuery): GetServiceCheckResultQuery {
    return new GetServiceCheckResultQuery(props);
  }
}
