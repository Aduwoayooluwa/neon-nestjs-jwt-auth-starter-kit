import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('table')
  async getTable() {
    return this.authService.getTable('users');
  }

  @Post('create-table')
  async createTable() {
    await this.authService.createUserTable();
    return { message: 'Table created successfully' };
  }

  @Post('add-data')
  async addData(@Body() body: { name: string; description: string }) {
    await this.authService.insertData(body.name, body.description);
    return { message: 'Data inserted successfully' };
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() createUser: CreateUserDto) {
    await this.authService.registerUser(
      createUser.username,
      createUser.password,
    );
    return { message: 'User registered successfully' };
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() user_details: LoginUserDto) {
    const result = await this.authService.login(
      user_details.username,
      user_details.password,
    );
    return result;
  }
  // simple protected route for testing
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile() {
    return { message: 'This is a protected route' };
  }
}
