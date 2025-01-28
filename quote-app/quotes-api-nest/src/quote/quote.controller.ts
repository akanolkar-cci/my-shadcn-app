import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Inject,
  ClassSerializerInterceptor,
  UseInterceptors,
  VERSION_NEUTRAL,
  BadRequestException,
} from '@nestjs/common';
import { CreateQuoteDto } from './dto/create-quote.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TagsQuery } from './query/queryParams';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { QuoteServiceInterface } from './quote.service.interface';
import { SwaggerConstant } from 'src/core/constant/swagger.constant';
import { Quote } from './entities/quote.entity';
import { UserQuoteReaction } from './entities/user-quote-reaction.entity';
import { API_VERSION } from 'src/core/constant/env.constant';
import { IGetUser } from 'src/auth/interface/get-user.interface';
import { NEED_ID_MSG } from 'src/core/constant/constants';
import { UpdateQuoteDto } from './dto/update-quote.dto';

@ApiTags('Quotes')
@ApiHeader({
  name: 'API-Version',
})
@Controller({ path: 'quotes', version: [API_VERSION, VERSION_NEUTRAL] })
@UseInterceptors(ClassSerializerInterceptor)
export class QuoteController {
  constructor(
    @Inject('QuoteServiceInterface')
    private readonly quoteService: QuoteServiceInterface,
  ) {}

  @ApiOperation({
    description: 'Endpoint to like a quote',
  })
  @ApiOkResponse({ description: SwaggerConstant.UpdatedRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Patch('/:id/like/up')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  likeUp(@GetUser() user: IGetUser, @Param('id') id: string): Promise<Quote> {
    if (!id) {
      throw new BadRequestException(NEED_ID_MSG);
    }
    return this.quoteService.likeUp(user, id);
  }

  @ApiOperation({
    description: 'Endpoint to dislike a quote',
  })
  @ApiOkResponse({ description: SwaggerConstant.UpdatedRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Patch('/:id/dislike/up')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  dislikeUp(
    @GetUser() user: IGetUser,
    @Param('id') id: string,
  ): Promise<Quote> {
    if (!id) {
      throw new BadRequestException(NEED_ID_MSG);
    }
    return this.quoteService.dislikeUp(user, id);
  }

  @ApiOperation({
    description: 'Endpoint to remove like reaction of a quote',
  })
  @ApiOkResponse({ description: SwaggerConstant.UpdatedRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Patch('/:id/like/down')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  likeDown(@GetUser() user: IGetUser, @Param('id') id: string): Promise<Quote> {
    if (!id) {
      throw new BadRequestException(NEED_ID_MSG);
    }
    return this.quoteService.likeDown(user, id);
  }

  @ApiOperation({
    description: 'Endpoint to remove dislike reaction of a quote',
  })
  @ApiOkResponse({ description: SwaggerConstant.UpdatedRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Patch('/:id/dislike/down')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  dislikeDown(
    @GetUser() user: IGetUser,
    @Param('id') id: string,
  ): Promise<Quote> {
    if (!id) {
      throw new BadRequestException(NEED_ID_MSG);
    }
    return this.quoteService.dislikeDown(user, id);
  }

  @ApiOperation({
    description: 'Endpoint to add new quote',
  })
  @ApiCreatedResponse({ description: SwaggerConstant.CreatedRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  addQuote(
    @GetUser() user: IGetUser,
    @Body() createQuoteDto: CreateQuoteDto,
  ): Promise<Quote> {
    return this.quoteService.createQuote(user.id, createQuoteDto);
  }

  @ApiOperation({
    description:
      'Endpoint to fetch the quotes.This route can be also accessed without the access_token(logging in) for 10 times in a day.',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @ApiQuery({
    name: 'quote',
    required: false,
  })
  @ApiQuery({
    name: 'author',
    required: false,
  })
  @ApiBearerAuth()
  @Get()
  getQuotes(
    @Query('tags') tags: TagsQuery,
    @Query('quote') quote: string,
    @Query('author') author: string,
  ): Promise<Quote[]> {
    return this.quoteService.getAllQuotes(tags, quote, author);
  }

  @ApiOperation({
    description: 'Endpoint to fetch a quote by id',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getOneQuote(@Param('id') id: string): Promise<Quote> {
    if (!id) {
      throw new BadRequestException(NEED_ID_MSG);
    }
    return this.quoteService.getQuote(id);
  }

  @ApiOperation({
    description: 'Endpoint to update a quote',
  })
  @ApiOkResponse({ description: SwaggerConstant.UpdatedRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updateQuote(
    @Param('id') id: string,
    @Body() updateQuoteDto: UpdateQuoteDto,
  ): Promise<Quote> {
    if (!id) {
      throw new BadRequestException(NEED_ID_MSG);
    }
    return this.quoteService.updateQuote(id, updateQuoteDto);
  }

  @ApiOperation({
    description: 'Endpoint to delete a quote',
  })
  @ApiOkResponse({ description: SwaggerConstant.DeletedRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  deleteQuote(@Param('id') id: string): Promise<{ deleted: boolean }> {
    if (!id) {
      throw new BadRequestException(NEED_ID_MSG);
    }
    return this.quoteService.deleteQuote(id);
  }

  @ApiOperation({
    description: 'Endpoint to fetch users who liked the quote',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get(':id/like/users')
  findLikedQuoteUsers(@Param('id') id: string): Promise<UserQuoteReaction[]> {
    if (!id) {
      throw new BadRequestException(NEED_ID_MSG);
    }
    return this.quoteService.likedQuoteUsers(id);
  }

  @ApiOperation({
    description: 'Endpoint to fetch users who disliked the quote',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get(':id/dislike/users')
  findDislikedQuoteUsers(
    @Param('id') id: string,
  ): Promise<UserQuoteReaction[]> {
    if (!id) {
      throw new BadRequestException(NEED_ID_MSG);
    }
    return this.quoteService.dislikedQuoteUsers(id);
  }
}
