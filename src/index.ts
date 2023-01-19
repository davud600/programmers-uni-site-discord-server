import { poolPromise } from './databases';
import { Member } from './interfaces/members.interface';

const MILLISECONDS_IN_DAY = 86400000;
// const MILLISECONDS_IN_AN_HOUR = 3600000;
// const TIME_INTERVAL_HOURS = 6;
const testing_interval_time = 1000;
const MAX_DAYS_WITHOUT_PAYING = 28;

async function onMemberDuePayment(member: Member) {
  // message them on discord
  // message owners on discord

  const sql = `UPDATE members SET warned_about_payment='${1}' WHERE id='${
    member.id
  }'`;

  await poolPromise.execute(sql);
}

async function listenIfMemberHasntPaid() {
  const sql = `SELECT * FROM members`;

  const [members]: Array<Array<Member>> = await poolPromise.execute(sql);

  members.forEach(async (member: Member) => {
    if (
      Date.now() - Date.parse(member.last_paid) >
        MAX_DAYS_WITHOUT_PAYING * MILLISECONDS_IN_DAY &&
      member.warned_about_payment == false
    ) {
      await onMemberDuePayment(member);
    }
  });
}

function main() {
  setInterval(async () => {
    await listenIfMemberHasntPaid();
  }, testing_interval_time);
}

main();
