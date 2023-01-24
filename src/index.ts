import { Member } from './interfaces/members.interface';
import {
  downgradeRole,
  loginClient,
  upgradeRole,
  getServerMember,
  messageMember,
  messageMod,
} from './utils/discord';
import MembersService from './utils/members';
import { whitelist } from './config/whitelist.json';
import { mods } from './config/mods.json';

const MILLISECONDS_IN_HOUR = 3600000;
const DUE_PAYMENTS_TIME_INTERVAL_HOURS = 23;
const UPDATE_ROLES_TIME_INTERVAL_HOURS = 0.1667; // 10 minutes

// const testing_interval_time = 10000;

function isMember(discordUsername: string, serverMember: any): boolean {
  if (serverMember) return true;

  console.log(
    `Member with username: ${discordUsername}, does not exist on our discord server`,
  );

  return false;
}

async function warnMember(member: Member) {
  if (whitelist.includes(member.discord_username)) return;

  const serverMember = await getServerMember(member.discord_username);
  if (!isMember(member.discord_username, serverMember)) return;

  await messageMember(serverMember, member.last_paid);
  mods.forEach(
    async mod => await messageMod(mod, serverMember, member.last_paid),
  );

  await MembersService.warnMember(member.id);

  console.log(`Warned ${member.discord_username} about payment`);
}

async function removeMember(member: Member) {
  if (whitelist.includes(member.discord_username)) return;

  const serverMember = await getServerMember(member.discord_username);
  if (!isMember(member.discord_username, serverMember)) return;

  await MembersService.removeMember(member.id);
  await downgradeRole(serverMember);
}

async function checkDuePayments() {
  const membersToWarn = await MembersService.getMembersToWarn();
  const membersToRemove = await MembersService.getMembersToDowngrade();

  membersToWarn.forEach(async (member: Member) => await warnMember(member));
  membersToRemove.forEach(async (member: Member) => await removeMember(member));
}

async function updateRoles() {
  const members = await MembersService.getMembersToUpgrade();

  members.forEach(async (member: Member) => {
    const serverMember = await getServerMember(member.discord_username);
    if (!isMember(member.discord_username, serverMember)) return;

    upgradeRole(serverMember);
  });
}

function main() {
  loginClient(); // auth discord bot

  setInterval(
    checkDuePayments,
    DUE_PAYMENTS_TIME_INTERVAL_HOURS * MILLISECONDS_IN_HOUR,
    // testing_interval_time,
  );
  setInterval(
    updateRoles,
    UPDATE_ROLES_TIME_INTERVAL_HOURS * MILLISECONDS_IN_HOUR,
    // testing_interval_time,
  );
}

main();
