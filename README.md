# programmers-uni-site-discord-server

Discord bot.

Uses discord api to update roles of members in discord server depending on their payment status.

Runs 2 intervals:

  checkDuePayments (every 23 hours)
    - Fetches from database members that need to be warned about monthly payment, and members that need to be removed (didnt pay for this month).
    - Warns members that need to be warned about payment by sending them private message on discord, also sends the owners messages informing them about this member's payment.
    - Removes certain permissions from members that haven't paid this month.
    
  updateRoles (every 10 minuts)
    - Fetches from database memebrs that need their permissions on discord server upgraded.
    - Upgrade each one's role (adding permissions) by using discord api.
