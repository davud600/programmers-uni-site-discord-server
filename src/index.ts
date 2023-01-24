import { poolPromise } from './databases';
import { Member } from './interfaces/members.interface';
import {
  downgradeRole,
  loginClient,
  upgradeRole,
  getServerMember,
} from './utils/discord';

const MILLISECONDS_IN_HOUR = 3600000;
const DUE_PAYMENTS_TIME_INTERVAL_HOURS = 23;
const UPDATE_ROLES_TIME_INTERVAL_HOURS = 0.1667; // 10 minutes
const MAX_DAYS_WITHOUT_PAYING_WARNING = 28;
const MAX_DAYS_WITHOUT_PAYING = 32;

const testing_interval_time = 10000;

function isMember(discordUsername: string, serverMember: any): boolean {
  if (!serverMember) {
    console.log(
      `Member with username: ${discordUsername}, does not exist on our discord server`,
    );

    return false;
  }

  return true;
}

async function warnMember(member: Member) {
  const serverMember = await getServerMember(member.discord_username);
  if (!isMember(member.discord_username, serverMember)) return;

  // message them on discord
  // message owners on discord

  const sql = `UPDATE members SET warned_about_payment='${1}' WHERE id='${
    member.id
  }'`;

  await poolPromise.execute(sql);

  console.log(`Warned ${member.discord_username} about payment`);
}

async function removeMember(member: Member) {
  const serverMember = await getServerMember(member.discord_username);
  if (!isMember(member.discord_username, serverMember)) return;

  const sql = `UPDATE members SET warned_about_payment='${0}', is_member='${0}' WHERE id='${
    member.id
  }'`;

  await poolPromise.execute(sql);
  await downgradeRole(serverMember);
}

async function checkDuePayments() {
  const sqlWarnings = `SELECT * FROM members 
WHERE last_paid < DATE_SUB(CURDATE(), INTERVAL ${MAX_DAYS_WITHOUT_PAYING_WARNING} DAY) AND warned_about_payment='${0}' AND is_member='${1}'`;
  const sqlRemove = `SELECT * FROM members 
WHERE last_paid < DATE_SUB(CURDATE(), INTERVAL ${MAX_DAYS_WITHOUT_PAYING} DAY) AND warned_about_payment='${1}' AND is_member='${1}'`;

  const [membersToWarn]: Array<Array<Member>> = await poolPromise.execute(
    sqlWarnings,
  );

  const [membersToRemove]: Array<Array<Member>> = await poolPromise.execute(
    sqlRemove,
  );

  membersToWarn.forEach(async (member: Member) => await warnMember(member));
  membersToRemove.forEach(async (member: Member) => await removeMember(member));
}

async function updateRoles() {
  const sql = `SELECT * FROM members WHERE last_paid > DATE_SUB(CURDATE(), INTERVAL ${MAX_DAYS_WITHOUT_PAYING_WARNING} DAY) AND is_member='${1}'`;

  const [members]: Array<Array<Member>> = await poolPromise.execute(sql);

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
    // DUE_PAYMENTS_TIME_INTERVAL_HOURS * MILLISECONDS_IN_HOUR,
    testing_interval_time,
  );
  setInterval(
    updateRoles,
    // UPDATE_ROLES_TIME_INTERVAL_HOURS * MILLISECONDS_IN_HOUR,
    testing_interval_time,
  );
}

main();
