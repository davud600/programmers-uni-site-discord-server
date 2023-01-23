import {
  DISCORD_BOT_TOKEN,
  DISCORD_GUILD_ID,
  MEMBER_ROLE_ID,
} from '../config/index';
import discord from 'discord.js';
import { whitelist } from '../config/whitelist.json';
// import blacklist from '../config/blacklist.json';

const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildMembers,
  ],
});

client.on('ready', async () => {
  console.log(`Logged in as ${client?.user?.tag}!`);
});

const changeMemberRole = async (
  memberUsername: string,
  ROLE_ID: any,
  upgrading: boolean = true,
) => {
  const guild: any = client.guilds.cache.get(DISCORD_GUILD_ID ?? '');

  const members: any[] = await guild.members.fetch();

  const member: any = members.find(
    member => member.user.tag === memberUsername,
  );

  if (!member) {
    console.log(
      `Member with username: ${memberUsername}, was not found in the server!`,
    );
    return;
  }

  if (member.roles.cache.has(ROLE_ID)) {
    console.log(`${member.user.tag} is already a Member`);
    return;
  }

  member.roles.add(ROLE_ID);
  console.log(`${member.user.tag} just became a Member`);
};

const loginClient = () => client.login(DISCORD_BOT_TOKEN);

const upgradeRole = (memberUsername: string) =>
  changeMemberRole(memberUsername, MEMBER_ROLE_ID, true);

const downgradeRole = (memberUsername: string) =>
  changeMemberRole(memberUsername, MEMBER_ROLE_ID, false);

export { loginClient, upgradeRole, downgradeRole };
