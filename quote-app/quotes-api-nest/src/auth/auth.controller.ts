import {
  Controller,
  Post,
  Body,
  UseGuards,
  Inject,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthServiceInterface } from './interface/auth.service.interface';
import { UserServiceInterface } from 'src/user/user.service.interface';
import { SwaggerConstant } from 'src/core/constant/swagger.constant';
import { User } from 'src/user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { API_VERSION } from 'src/core/constant/env.constant';

@ApiTags('Auth')
@ApiHeader({
  name: 'API-Version',
})
@Controller({ path: 'auth', version: [API_VERSION, VERSION_NEUTRAL] })
export class AuthController {
  constructor(
    @Inject('AuthServiceInterface')
    private authService: AuthServiceInterface,
    @Inject('UserServiceInterface')
    private userService: UserServiceInterface,
  ) {}

  @ApiOperation({
    description:
      'Endpoint for a user to login. For the userName, provide the email that was used during sign-up',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  login(@Body() data: CreateAuthDto, @GetUser() user): Promise<LoginUserDto> {
    return this.authService.login(user);
  }

  @ApiOperation({
    description:
      'Endpoint for a user to sign-up. For login the email will be used as user name',
  })
  @ApiCreatedResponse({ description: SwaggerConstant.CreatedRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Post('/sign-up')
  signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }
}
