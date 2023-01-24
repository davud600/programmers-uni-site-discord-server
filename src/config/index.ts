import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  DB_HOST,
  DB_USER,
  DB_DATABASE,
  DB_PASSWORD,
  DB_PORT,
  DISCORD_BOT_TOKEN,
  DISCORD_GUILD_ID,
  MEMBER_ROLE_ID,
  API_SERVER_LINK,
} = process.env;
