import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql: any) {}

  async getTable(name: string): Promise<any[]> {
    return await this.sql(`SELECT * FROM ${name}`);
  }

  async createTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS playing_with_neon (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT
      );
    `;
    await this.sql(query);
  }

  async insertData(name: string, description: string): Promise<void> {
    const query = `
      INSERT INTO playing_with_neon (name, description)
      VALUES ($1, $2);
    `;
    await this.sql(query, [name, description]);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
