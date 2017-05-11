// A necessary glue?

import React from 'react'
import { Route } from 'react-router'
import firebase from 'APP/fire'
const db = firebase.database()
import AdventureUsTimeline from './Timeline'

// the reason for this container is to allow for an enhancement
// to parameterize the route
// userRef will equal db.ref('users').child({name})
// and pass in name to the below function
// we need tripRef, userRef (logged in user) and usersRef so we can get their names
//  we're using all this hard coded stuff in the timeline component. It should work when we pass in real props and data.
const dummyTripRef = firebase.database().ref('trips/' + '-KjiydWj11D-d4b5FbQP')
const dummyUserId = '5yOrpwkmkobSCtirjteNFoKPsJl1'

export default () =>
  <div>
    <AdventureUsTimeline tripRef={dummyTripRef} userId={dummyUserId} usersRef={db.ref('users')}/>
  </div>
// need to replace dummyTripRef with props.tripRef
// need to replace dummyUserRef with props.userRef
