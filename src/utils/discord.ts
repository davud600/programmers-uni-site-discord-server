import {
  DISCORD_BOT_TOKEN,
  DISCORD_GUILD_ID,
  MEMBER_ROLE_ID,
} from '../config/index';
import discord from 'discord.js';

const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildMembers,
  ],
});

let guild: any;

client.on('ready', async () => {
  console.log(`Logged in as ${client?.user?.tag}!`);

  guild = client.guilds.cache.get(DISCORD_GUILD_ID ?? '');
});

const getServerMembers = async () => await guild.members.fetch();

const getServerMember = async (discordUsername: string) =>
  getServerMembers().then((members: any[]) =>
    members.find(member => member.user.tag === discordUsername),
  );

const changeMemberRole = async (
  member: any,
  ROLE_ID: any,
  upgrading: boolean = true,
) => {
  if (member.roles.cache.has(ROLE_ID)) {
    if (upgrading) {
      console.log(`${member.user.tag} is already a Member`);
      return;
    }

    member.roles.remove(ROLE_ID);
    console.log(`${member.user.tag} just got their Member role removed`);
    return;
  }

  if (upgrading) {
    member.roles.add(ROLE_ID);
    console.log(`${member.user.tag} just became a Member`);
    return;
  }
};

const loginClient = () => client.login(DISCORD_BOT_TOKEN);

const upgradeRole = (member: any) =>
  changeMemberRole(member, MEMBER_ROLE_ID, true);

const downgradeRole = (member: any) =>
  changeMemberRole(member, MEMBER_ROLE_ID, false);

export { loginClient, upgradeRole, downgradeRole, getServerMember };
