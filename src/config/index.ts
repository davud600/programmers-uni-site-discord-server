import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  DISCORD_BOT_TOKEN,
  DISCORD_GUILD_ID,
  MEMBER_ROLE_ID,
  API_SERVER_LINK,
} = process.env;
