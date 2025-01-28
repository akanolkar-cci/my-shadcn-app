import { DataSourceOptions } from 'typeorm';
import * as dotEnv from 'dotenv';
import { ENV_FILE_PATH } from 'src/core/constant/env.constant';

dotEnv.config({ path: ENV_FILE_PATH });

const ormConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
  migrationsRun: true,
};

export default ormConfig;
