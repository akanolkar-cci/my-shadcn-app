import {
  Controller,
  Get,
  Inject,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { API_VERSION } from 'src/core/constant/env.constant';
import { SwaggerConstant } from 'src/core/constant/swagger.constant';
import { AuthorServiceInterface } from './author.service.interface';
import { GetAuthorsDto } from './dto/get-authors.dto';

@ApiTags('Authors')
@ApiHeader({
  name: 'API-Version',
})
@Controller({ path: 'authors', version: [API_VERSION, VERSION_NEUTRAL] })
export class AuthorController {
  constructor(
    @Inject('AuthorServiceInterface')
    private readonly authorService: AuthorServiceInterface,
  ) {}

  @ApiOperation({
    description: 'Endpoint to fetch all the authors of the quotes.',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getAllAuthors(): Promise<GetAuthorsDto[]> {
    return this.authorService.fetchAllAuthors();
  }
}
