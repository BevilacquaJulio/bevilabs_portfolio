import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, type AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { LoginDto, RefreshDto } from './dto/login.dto';
import { AuthService, type TokenPair } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autentica o admin e devolve access + refresh token' })
  login(@Body() body: LoginDto): Promise<TokenPair> {
    return this.authService.login(body.password);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotaciona o refresh token e emite um novo par' })
  refresh(@Body() body: RefreshDto): Promise<TokenPair> {
    return this.authService.refresh(body.refreshToken);
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoga o refresh token informado' })
  logout(@Body() body: RefreshDto): Promise<void> {
    return this.authService.logout(body.refreshToken);
  }

  @Get('me')
  @ApiOperation({ summary: 'Retorna o admin autenticado' })
  me(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}
