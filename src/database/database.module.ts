import { config } from 'dotenv';
import { Module } from '@nestjs/common';
import { neon } from '@neondatabase/serverless';

import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';

config({
  path: ['.env', '.env.production', '.env.local'],
});

const sql = neon(process.env.DATABASE_URL);

const dbProvider = {
  provide: 'POSTGRES_POOL',
  useValue: sql,
};

@Module({
  controllers: [DatabaseController],
  providers: [DatabaseService, dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
