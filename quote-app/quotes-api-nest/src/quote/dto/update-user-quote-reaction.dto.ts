import { PartialType } from '@nestjs/swagger';
import { CreateUserQuoteReactionDto } from './create-user-quote-reaction.dto';

export class UpdateUserQuoteReactionDto extends PartialType(
  CreateUserQuoteReactionDto,
) {}
