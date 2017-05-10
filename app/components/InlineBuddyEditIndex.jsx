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
    tripsRef={db.ref('trips')}
    usersRef={db.ref('users')}
    auth={auth}
    userId={props.userId} />
  </div>
