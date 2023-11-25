import { CommandProps } from '@app/common/ddd/command.base';
import { QueryBase } from '@app/common/ddd/query.base';

export class GetIntegrationQuery extends QueryBase {
  readonly id: string;

  private constructor(props: CommandProps<GetIntegrationQuery>) {
    super();
    this.id = props.id!;
  }

  static create(props: GetIntegrationQuery): GetIntegrationQuery {
    return new GetIntegrationQuery(props);
  }
}
