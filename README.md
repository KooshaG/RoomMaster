# Room Master 📚
Library reservation bot for the concordia written in javascript with a website interface

---

Hello!

This is a bot that I made to reserve spots in the library at my university so that I didn't have to do the reservations manually

The website is mostly functional and the bot works pretty reliably at this point so development might be slower because of that.

## The Bot
The actual business logic in this application isn't built in to the website at all. It instead leverages timer functions in Azure that make the reservation script run every 2 hours. 
The initial script will gather all the users that are [verified](#Verification?) and check if they have made an attempt to make a reservation in the past 12 hours. If the user is verified and hasn't made a request in the past 12 hours, the script will trigger another function to make the reservations on behalf of the user.

### Tech Used
- Javascript
- Puppeteer
- Prisma
- Node.Js
- Azure Functions

## The Site
The website is a simple portal for people to manage their reservation settings, view their reservations and change the information used during the reservation process.

Currently the only way to login is with GitHub but I might add more Oauth providers later on.

[Check out RoomMaster!](https://roommaster.koosha.dev)

More features may come soon! (Room preferences 🤫)

### Tech Used
- Javascript
- Next.Js
- Tailwind w/ Daisy UI
- Prisma

## Verification? 
Currently RoomMaster is setup with a verification process before any reservations are made for you. They are decided by me and is not automated at all so message me if you want verified quickly lol.

