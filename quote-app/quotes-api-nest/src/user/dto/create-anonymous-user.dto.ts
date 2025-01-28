import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateAnonymousUserDto {
  @ApiProperty()
  @IsString()
  uniqueAddress: string;

  @ApiProperty()
  @IsInt()
  rateLimit: number;
}
