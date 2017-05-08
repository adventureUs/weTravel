// A necessary glue?

import React from 'react'
import { Route } from 'react-router'
import firebase from 'APP/fire'
const db = firebase.database()
import InlineBuddyEdit from './InlineBuddyEdit'
const auth = firebase.auth()

export default () =>
  <div>
    <InlineBuddyEdit userRef={db.ref('users')} auth={auth} />
  </div>
