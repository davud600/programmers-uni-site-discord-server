import { poolPromise } from './databases';
import { Member } from './interfaces/members.interface';
import { loginClient, upgradeRole } from './utils/discord';

const MILLISECONDS_IN_HOUR = 3600000;
const DUE_PAYMENTS_TIME_INTERVAL_HOURS = 23;
const UPDATE_ROLES_TIME_INTERVAL_HOURS = 0.25; // 15 minutes
const MAX_DAYS_WITHOUT_PAYING = 28;

const testing_interval_time = 10000;

async function onMemberDuePayment(member: Member) {
  // message them on discord
  // message owners on discord

  const sql = `UPDATE members SET warned_about_payment='${1}' WHERE id='${
    member.id
  }'`;

  await poolPromise.execute(sql);
}

async function checkDuePayments() {
  const sql = `SELECT * FROM members 
WHERE last_paid < DATE_SUB(CURDATE(), INTERVAL ${MAX_DAYS_WITHOUT_PAYING} DAY)`;

  const [members]: Array<Array<Member>> = await poolPromise.execute(sql);

  members.forEach(async (member: Member) => await onMemberDuePayment(member));
}

async function updateRoles() {
  const sql = `SELECT * FROM members WHERE is_member='${1}'`;

  const [members]: Array<Array<Member>> = await poolPromise.execute(sql);

  members.forEach(async (member: Member) => {
    // change their role using discord api if they arent member already
    upgradeRole(member.discord_username);
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
    // UPDATE_ROLES_TIME_INTERVAL_HOURS * MILLISECONDS_IN_HOUR,
    testing_interval_time,
  );
}

main();
