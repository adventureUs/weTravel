* Allison overviews what we currently have, a lot is broken because of changes in how the database is structured

* Ashi suggestion: make the buddies view look more like a chat roster and display less information -- show as short form items: (status, location), maybe location as time zone in the short form

* Ashi suggestion: one view of chat, and collapsed view of chat that shows the links that people have given, with a bit of information in each one, hides low information discussion messages -- only shows 'suggestions' -- reply to suggestions specifically (like a fb screen?), but also you can expand it and just look at chat

* Ashi: maybe no need to have defined start and end date for the trip since maybe not everyone who is going and arrives and leaves at the same time so maybe not two views of the timeline

* Ashi: Stable url --> a good way to pass around the currentTrip id 

* Ashi: LOW PRIORITY: Set up 'security rules' in firebase console!, can put rules per userId (for example you must be this user to edit this user, you must be a buddy in order to edit something on this trip)

* Ashi: Write a higher level component to wrap all of the onAuthStateChange

* Be aware of when to use 'once' listener --> like when you first get --> 'once' is the same as 'on' and 'off'

* Ashi --> have a component which JUST grabs all of the trip --> links to parametrized dashboard

* '.on' returns the function you passed in as the listener 

* Fine to have two listeners 

* Refactor dashboard into two components --> one that does the trip listening, (trips menu) one that just shows a particular trip

* Have diff components care about just a particular part of the firebase database tree

* Could also have a trip navigation outside of dashboard, --> titlebar should be outside of dashboard, could receive props from the routers --> should know what the current trip is

* Just listen to 'value' --> not 'child-added';  of reference, get the last 100, infinite scrolling higher level components ... what?




