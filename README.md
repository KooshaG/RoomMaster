# LibraryReservationBot v2
Library reservation bot for the concordia written in javascript with a website interface

The original reservation bot implementation used python which caused difficulties when creating a larger system around the bot as the 
utilization of a database with different types of information was too difficult to implement effectively. Below is the original readme from the other repo

Hello!

This is a bot that I made to reserve spots in the library at my university so that I didn't have to do the reservations manually

It's currently a work in progress as there's still some stuff that needs to be done to get it working how I want it

## Things that need to be worked on
- [ ] Work on database
  - [ ] Store multiple users in database to allow one script to reserve for more than 1 person
    - User login info (Find a way to secure info)
    - Dates that the user already reserved
    - Reservation days of the week for the user
    - Each Reservation day stores a list of rooms that the user wants to reserve
  - [ ] Allow user to have prefered rooms for each day of the week that they want
  - [ ] Implement an ORM to make working with database less complicated
- [ ] Collect cancellation links that are sent in email confirmation
- [ ] Frontend that can help change reservation settings for users
