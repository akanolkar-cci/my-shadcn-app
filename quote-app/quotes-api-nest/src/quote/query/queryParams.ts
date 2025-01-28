import { ApiProperty } from '@nestjs/swagger';

export class TagsQuery {
  @ApiProperty({
    description: 'semicolon-separated values or single value',
    default: 'Motivational',
    required: false,
  })
  tags: string;
}

export class TagQuery {
  @ApiProperty({ default: 'Motivational', required: false })
  tag: string;
}

export class QuoteQuery {
  @ApiProperty({ required: false })
  quote: string;
}

export class AuthorQuery {
  @ApiProperty({ required: false })
  author: string;
}
