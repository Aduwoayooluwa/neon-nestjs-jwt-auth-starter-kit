import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('POSTGRES_POOL') private readonly sql: any,
    private readonly jwtService: JwtService,
  ) {}

  async getTable(name: string): Promise<any[]> {
    return await this.sql(`SELECT * FROM ${name}`);
  }

  async registerUser(username: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (username, password)
      VALUES ($1, $2);
    `;
    await this.sql(query, [username, hashedPassword]);
  }

  //   ? validate the user
  async validateUser(username: string, password: string): Promise<any> {
    const result = await this.sql(`SELECT * FROM users WHERE username = $1`, [
      username,
    ]);
    const user = result[0];
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async login(username: string, password: string): Promise<any> {
    try {
      const user = await this.validateUser(username, password);

      if (user) {
        const payload = { username: user.username, sub: user.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }

      throw new HttpException(
        { message: 'Invalid credentials', statusCode: HttpStatus.UNAUTHORIZED },
        HttpStatus.UNAUTHORIZED,
      );
    } catch (error) {
      console.error('Login Error:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'An unexpected error occurred',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUserTable(): Promise<void> {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
    await this.sql(query);
  }

  async insertData(username: string, password: string): Promise<void> {
    const query = `
      INSERT INTO users (name, description)
      VALUES ($1, $2);
    `;
    await this.sql(query, [username, password]);
  }
}
