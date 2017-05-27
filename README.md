adventureUs
===========

Have you ever experienced the disorganization of group travel planning? Use adventureUs to make your next group trip seamless!

adventureUs is a place where you can virtually meet up with your buddies and plan your next great adventure together. Once you sign up, you can begin planning a trip by filling in your availability dates and inviting buddies to join you.  Next, add sticky notes for ideas for a trip and see which ones get the most likes.

[https://adventureus.tech/](https://adventureus.tech/)

Created by <a href="https://github.com/AllisonAV">Allison Alexander</a>, <a href="https://github.com/TinaHeiligers">Tina Heiligers</a>, <a href="https://github.com/meschreiber">Maria Schreiber, <a href="https://github.com/stefsulzer">Stefanie Sulzer<a/>.

Powered by Firebase and React.js

Current functionality
-----------------
- Multiple users can share one trip where they can:
  - Chat in realtime with other users
  - Share and edit their own availability dates and homebase
  - Share, like, and delete ideas about what to do on the trip
- A timeline showcases all availability dates and timing of ideas
- Each user can create and name multiple trips and invite different buddies on to these trips


Known issues
------------
- [ ] Users can 'like' an idea indefintely and cannot 'unlike' an idea
- [ ] Currently no security check to see if a new user is on the 'pending buddies' list before being added on to a trip
- [ ] Users can delete any idea, regardless of whether they created the idea or not
- [ ] Refactoring needed to separate concerns into more succinct functions and wrapper React components


Future features
---------------
- A help me section to explain functionalities
- A mobile version that will allow users to upload photos to share with their buddies, once they are actually on their trip
- A unique e-mail address generated for each trip, where users can forward confirmation e-mails (accomodation, flight, etc.) which will then be placed automatically on the timeline
- Integration of Google Places API to show buddies' homebases and travel destinations
- A chatbot which will give suggestions of where to travel based on users' homebase, attempting to roughly equalize travel cost among all buddies
- A chatbot which will give suggestions of activities, accomodations, etc. once a destination has been selected
- Expense tracking and settling via Venmo or Paypal

