import { validate } from 'class-validator';
import { CreateUserQuoteReactionDto } from './create-user-quote-reaction.dto';
import { plainToInstance } from 'class-transformer';
import { checkValidationErrorMessage } from 'src/core/helper.service';

describe('CreateUserQuoteReactionDto', () => {
  let createUserQuoteReactionDto: CreateUserQuoteReactionDto;

  beforeEach(() => {
    createUserQuoteReactionDto = new CreateUserQuoteReactionDto();
  });

  it('should be defined', () => {
    expect(createUserQuoteReactionDto).toBeDefined();
  });

  it('should throw error when userId is empty', async () => {
    const importinfo = {
      userId: '',
      quoteId: '',
      like: false,
      dislike: false,
    };
    const ofimportdto = plainToInstance(CreateUserQuoteReactionDto, importinfo);
    const errors = await validate(ofimportdto);
    expect(errors.length).not.toBe(0);
    expect(checkValidationErrorMessage(errors)).toContain(
      `userId should not be empty`,
    );
    expect(checkValidationErrorMessage(errors)).toContain(
      `quoteId should not be empty`,
    );
  });
});
