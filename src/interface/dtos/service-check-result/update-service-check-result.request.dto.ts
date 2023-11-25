export class UpdateServiceCheckResultRequestDto {
  readonly serviceCheckResultId: string;
  readonly status?: number;
  readonly duration?: number;
  readonly response?: string;
}
