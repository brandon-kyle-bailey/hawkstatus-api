export class CreateServiceCheckRequestDto {
  readonly name: string;
  readonly url: string;
  readonly interval: number;
  readonly timeout: number;
  readonly alertCheckThreshold: number;
  readonly method: string;
  readonly body: string;
  readonly headers: { [key: string]: any };
  readonly status: string;
  readonly type: string;
}
