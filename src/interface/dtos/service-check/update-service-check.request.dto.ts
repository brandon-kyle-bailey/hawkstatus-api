export class UpdateServiceCheckRequestDto {
  readonly serviceCheckId: string;
  readonly name?: string;
  readonly url?: string;
  readonly interval?: number;
  readonly timeout?: number;
  readonly alertCheckThreshold?: number;
  readonly method?: string;
  readonly body?: string;
  readonly headers?: { [key: string]: string }[];
  readonly status?: string;
  readonly type?: string;
}
