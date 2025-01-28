import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateUserQuoteReactionDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  quoteId: string;

  @ApiProperty()
  @IsBoolean()
  like: boolean;

  @ApiProperty()
  @IsBoolean()
  dislike: boolean;
}
