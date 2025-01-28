import * as dotenv from 'dotenv';
export const ENV_FILE_PATH = `./.env.stage.${process.env.STAGE}`;

dotenv.config({ path: ENV_FILE_PATH });

export const API_VERSION = process.env.API_VERSION;
