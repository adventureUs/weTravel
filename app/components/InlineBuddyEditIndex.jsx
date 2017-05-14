// A necessary glue?

import React from 'react'
import { Route } from 'react-router'
import firebase from 'APP/fire'
const db = firebase.database()
import InlineBuddyEdit from './InlineBuddyEdit'
const auth = firebase.auth()

// the reason for this container is to allow for an enhancement
// to parameterize the route
// userRef will equal db.ref('users').child({name})
// and pass in name to the below function
export default (props) =>
  <div>
    <InlineBuddyEdit
      userId={props.userId}
      tripRef={props.tripRef}
      tripId={props.tripId}
      tripsRef={db.ref('trips')}
      usersRef={db.ref('users')}
      auth={auth} />
  </div>
