export class CreateServiceCheckResultRequestDto {
  readonly serviceCheckId: string;
  readonly status: number;
  readonly duration: number;
  readonly response: string;
}
