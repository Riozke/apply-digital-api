import { ApiProperty } from '@nestjs/swagger';

export class SimpleResponseDTO {
  @ApiProperty({ description: 'Status code' })
  statusCode: number;

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Optional error message' })
  error?: string;
}
