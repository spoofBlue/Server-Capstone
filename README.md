# Server-Capstone

Live App link: https://mighty-falls-28563.herokuapp.com/ 
(If you would like an account with entries already included, sign in with the username "Bobby" and the password "hellohello" without the quotation marks.)

Quick Project Summary:
This is my project site called Harvest United.  The goal of the site is to connect restaurants and markets that naturally hold excess food, with non-profit organizations (food shelters, soup kitchens) for a food exchange.

My Purpose:
This project was created after my Thinkful Unit on server-side programming; therefore, my project focused on server routing, database management, and server testing.

______________________________________________________________
How the site works:
User can either create "donator" or "receiver" entries.  
- Restaurants, diners, super markets, etc would qualify as food donators.  When they create a donator entry, they provide their location, a brief note on what their business does, and what food items they're able to donate. 
- Homeless shelters, soup kitchens, and other non-profit organizations would qualify as food receivers.  When they create a receiver entry, they provide their location, a brief note on what their organization does, and what quantity of food they would ideally receive.
- Whether they're a donator or receiver, they also present their contact information (name, e-mail, phone number) for connection.
- Users can search for either donator or receiver entries near their zipcode, which the user can access for contact information.

______________________________________________________________
Libaries and Tools:
This section partially educates viewers of the README on what programs they may need to be familiar with reading.  Additionally, I'm showcase my knowledge of these tools most-integral to this project.
- JQuery: Client-side Javascript DOM-interaction library. https://jquery.com/
- Materialize: Client-side CSS-framework (limited use). https://materializecss.com/
- Geoname API: API can take a zipcode input and output other nearby zipcodes. http://www.geonames.org/export/web-services.html#findNearbyPostalCodes
- Node.js: Server-side Javascript implementation. https://nodejs.org/en/
- Express: Server-side framework. https://expressjs.com/
- Passport.js: Authentication library. http://www.passportjs.org/
- MongoDB: Database. https://www.mongodb.com/
- Mongoose: Mongo-based model library. https://mongoosejs.com/
- Chai: Local integration testing. http://www.chaijs.com/
- Git: Version management and deployment. https://git-scm.com/
- NPM: Javascript package manager. https://www.npmjs.com/
- Nodemon: Code development assistance tool. https://nodemon.io/
- Travis CI: Automated online testing. https://travis-ci.org/
- Heroku: Cloud-based server platform. https://devcenter.heroku.com/
- mLab: Cloud-based database. https://mlab.com/
______________________________________________________________
Additional updates I plan to make upon revisiting the project:
When I invest more time into this project, my first priority will be the client-side aesthetic of the page.  The following changes would make my site more attractive to my users:
1. I would remove the obvious box-style of the buttons, sections, and menu options.  Although it's clear where all the interactive elements on the page represent, the "modern look" is more free-flowing and doesn't feel so robotic.
2. Make interactions more satisfying through subtle animations.  When interacting with some buttons and submissions, sliding selected or new sections into their location shows the user the how the program transitions between their actions and it's effect on the webpage. It's a quality of life boast.
3. I could reconsider the color pallette as well.  It's just not something I'll obsess over for now.  If I change the box-style of most of the elements, I can then decide how to color the page.
4. I would make more media queries affecting the size of entries and forms. I would allow several entries to display in a row on larger screens, as well as multiple fields to occupy rows of a form on larger screen.  Forms are more spacious than necessary.

Again, I'm pleased with the functionality of the page (both from the client-side JS and the server-side JS), but I believe the appearance needs some work.

Additionally, some features I would add to the site:
5. The number of entries in the Search results or My Entries page should be capped to ten or twenty entries, followed by buttons allowing the user to see more of the results. Grouping these entries prevents exhaustively long pages.
6. Currently, the site has two pages: the login/create-account page, and the main page.  The main page subdivides the userflow of the site into discreet sections. The page transition uses localStorage and a redirect link, the section transition uses JQuery event handlers.  If I switched to a React-Redux model, the page routing would be simple, the user can back out of sections properly, form responsiveness would be cleaner (with redux-form), and many of these updates become easier to implement.
7. I would add a section that allows a user to edit their profile info.
8. I would allow users to send a notification on site that they're interested in fulfilling a particular entry.  This communication has many possibilities, including messaging associated with a specific entry.
9. The default search criteria is based on proximity to the area code provided. I could give users the ability to search for entries from a particular user or for a particular business.
10. I would allow users to save entries or users they wish to stay in touch with.
11. I would consider having entries expire/ become invisible after a time period of inactivty from the user (until they log back in reactivate the entries.
12. There are a few CSS choices that are not mobile-first in design, I would go back and correct those properties to be mobile-first.

______________________________________________________________
Reflection / Things I would have done differently:
- Now that I'm familiar with the React-Redux model, I would love to reimplement this project in that format.  The responsiveness makes a large difference. 
- One mistake I had in created the CSS for this project was not designing mobile-first; as a result, I make media-queries accounting for smaller screen sizes to correct this.  In a thorough update of this project, and in future projects, I will have this mindset.
- I used the Materialize CSS-framework for this project.  Although it was helpful in some regards (it brought in pre-made fade-effects and animations), it also brought in some annoying properties which I had to correct forcefully (through the CSS !important affix).  It may have been worth opting out of the use of Materialize. Pros and Cons.
______________________________________________________________
Screenshots:

