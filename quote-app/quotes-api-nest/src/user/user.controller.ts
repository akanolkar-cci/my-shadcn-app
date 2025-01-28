import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Inject,
  ClassSerializerInterceptor,
  UseInterceptors,
  VERSION_NEUTRAL,
  BadRequestException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { UserServiceInterface } from './user.service.interface';
import { QuoteServiceInterface } from 'src/quote/quote.service.interface';
import { SwaggerConstant } from 'src/core/constant/swagger.constant';
import { User } from './entities/user.entity';
import { Quote } from 'src/quote/entities/quote.entity';
import { UserQuoteReaction } from 'src/quote/entities/user-quote-reaction.entity';
import { API_VERSION } from 'src/core/constant/env.constant';
import { IGetUser } from 'src/auth/interface/get-user.interface';
import { NEED_ID_MSG } from 'src/core/constant/constants';

@ApiTags('Users')
@ApiHeader({
  name: 'API-Version',
})
@Controller({ path: 'users', version: [API_VERSION, VERSION_NEUTRAL] })
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    @Inject('UserServiceInterface')
    private readonly usersService: UserServiceInterface,
    @Inject('QuoteServiceInterface')
    private readonly quoteService: QuoteServiceInterface,
  ) {}

  @ApiOperation({
    description: 'Endpoint to fetch the user details',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findOne(@GetUser() user: IGetUser): Promise<User> {
    return this.usersService.findOne(user.id);
  }

  @ApiOperation({
    description: 'Endpoint to get the quotes added by the user',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get('/:id/quotes')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  fetchUserAddedQuotes(@Param('id') id: string): Promise<Quote[]> {
    if (!id) {
      throw new BadRequestException(NEED_ID_MSG);
    }
    return this.quoteService.userAddedQuotes(id);
  }

  @ApiOperation({
    description: 'Endpoint to fetch the users favourite quotes',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get('/:id/favourite-quotes')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  fetchUsersFavouriteQuotes(
    @Param('id') id: string,
  ): Promise<UserQuoteReaction[]> {
    if (!id) {
      throw new BadRequestException(NEED_ID_MSG);
    }
    return this.quoteService.userLikedQuotes(id);
  }

  @ApiOperation({
    description: 'Endpoint to fetch the users least-liked quotes',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get('/:id/unfavourite-quotes')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  fetchUsersUnfavouriteQuotes(
    @Param('id') id: string,
  ): Promise<UserQuoteReaction[]> {
    if (!id) {
      throw new BadRequestException(NEED_ID_MSG);
    }
    return this.quoteService.userDislikedQuotes(id);
  }

  @ApiOperation({
    description: 'Endpoint to update user details',
  })
  @ApiOkResponse({ description: SwaggerConstant.UpdatedRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Patch()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updateUser(
    @GetUser() user: IGetUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(user.id, updateUserDto);
  }

  @ApiOperation({
    description: 'Endpoint to delete a User by Id',
  })
  @ApiOkResponse({ description: SwaggerConstant.DeletedRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<string> {
    if (!id) {
      throw new BadRequestException(NEED_ID_MSG);
    }
    return this.usersService.deleteUser(id);
  }
}
