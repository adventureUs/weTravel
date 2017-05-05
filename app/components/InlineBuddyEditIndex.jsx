// A necessary glue? 

import React from 'react'
import { Route } from 'react-router'
import firebase from 'APP/fire'
const db = firebase.database()
import InlineBuddyEdit from './InlineBuddyEdit'
const auth = firebase.auth()

// This component is a little piece of glue between React router (in main.jsx)
// and our form component. It takes in props.params.name and
// shows the form along with that title.

// export default ({params: {name}}) =>
export default () =>
  <div>
    {/* Here, we're passing in a Firebase reference to
        /scratchpads/$scratchpadTitle. This is where the scratchpad is
        stored in Firebase. Each scratchpad is just a string that the
        component will listen to, but it could be the root of a more complex
      data structure if we wanted. */}
    <InlineBuddyEdit userRef={db.ref('users')} auth={auth} />
  </div>

