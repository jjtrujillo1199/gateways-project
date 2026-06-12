import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  private readonly ADMIN_USERNAME = 'admin';
  private readonly ADMIN_PASSWORD = 'admin';

  constructor(private readonly jwtService: JwtService) {}

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    if (
      dto.username !== this.ADMIN_USERNAME ||
      dto.password !== this.ADMIN_PASSWORD
    ) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = { username: dto.username, sub: 'admin-user' };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }
}
