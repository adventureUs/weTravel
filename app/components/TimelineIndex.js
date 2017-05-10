// A necessary glue?

import React from 'react'
import { Route } from 'react-router'
import firebase from 'APP/fire'
const db = firebase.database()
import Timeline from './Timeline'

// the reason for this container is to allow for an enhancement
// to parameterize the route
// userRef will equal db.ref('users').child({name})
// and pass in name to the below function
// we need tripRef, userRef (logged in user) and usersRef so we can get their names
const dummyTripRef = firebase.database().ref('trips/' + '-Kjiwdj3J4u0nPC7Ed0F')
const dummyUserRef = firebase.database().ref('users/' + 'NCzY2cDhT5a0PuOBF7tLT443t543')

export default () =>
  <div>
    <Timeline tripRef={dummyTripRef} userRef={dummyUserRef} usersRef={db.ref('users')}/>
  </div>
// need to replace dummyTripRef with props.tripRef
// need to replace dummyUserRef with props.userRef
