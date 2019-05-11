import path from 'path';
import knex from 'knex';
import { Config } from 'knex';

const BASE_PATH = __dirname;

export class Connection {
  public knex(): knex {
    return knex({
      client: 'pg',
      connection: process.env.DATABASE_URL,
      migrations: {
        directory: path.join(BASE_PATH, 'migrations')
      },
      seeds: {
        directory: path.join(BASE_PATH, 'seeds')
      }
    } as Config);
  }
}
