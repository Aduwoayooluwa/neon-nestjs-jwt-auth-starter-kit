import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('table')
  async getTable() {
    return this.appService.getTable('playing_with_neon');
  }

  @Post('create-table')
  async createTable() {
    await this.appService.createTable();
    return { message: 'Table created successfully' };
  }

  @Post('add-data')
  async addData(@Body() body: { name: string; description: string }) {
    await this.appService.insertData(body.name, body.description);
    return { message: 'Data inserted successfully' };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
