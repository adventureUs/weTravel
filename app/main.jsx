'use strict'
import React from 'react'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'
import { render } from 'react-dom'

// import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'
import Navbar from './components/Navbar'
import TravelBuddies from './components/TravelBuddies'
import BuddyEdit from './components/BuddyEdit'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'
import InlineBuddyEdit from './components/InlineBuddyEdit'
import firebase from 'APP/fire'


// ---- UNCOMMENT TO RESEED DATABASE ----------
// import {trips, users} from '../seedData'
// console.log('USERS', users, 'TRIPS', trips)
// firebase.database().ref('trips/').set(trips)
// firebase.database().ref('users/').set(users)

// Get the auth API from Firebase.
const auth = firebase.auth()
const google = new firebase.auth.GoogleAuthProvider()
const facebook = new firebase.auth.FacebookAuthProvider()
const email = new firebase.auth.EmailAuthProvider()

// Ensure that we have (almost) always have a user ID, by creating
// an anonymous user if nobody is signed in.
// auth.onAuthStateChanged(user => user || auth.signInAnonymously())

// Further explanation:
//
// Whenever someone signs in or out (that's an "authStateChange"),
// firebase calls our callback with the user. If nobody is signed in,
// firebase calls us with null. Otherwise, we get a user object.
//
// This line of code thus keeps us logged in. If the user isn't signed
// in, we sign them in anonymously. This is useful, because when the user
// is signed in (even anonymously), they'll have a user id which you can
// access with auth.currentUser.uid, and you can use that id to create
// paths where you store their stuff. (Typically you'll put it somewhere
// like /users/${currentUser.uid}).
//
// Note that the user will still be momentarily null, so your components
// must be prepared to deal with that. This is unavoidable—with Firebase,
// the user will always be null for a moment when the app starts, before
// the authentication information is fetched.
//
// If you don't want this behavior, just remove the line above.

// Our root App component just renders a little frame with a nav
// and whatever children the router gave us.

const App = () =>
  <div className='well'>
    {
      firebase.auth().currentUser ? <Dashboard /> : <Login />
    }

  </div>

render(
  <Router history={browserHistory}>
    <Route path="/" component={App} />
    <Route path="login" component={Login} google={google} facebook={facebook} email={email} />
    <Route path="dashboard" component={Dashboard} />
    <Route path="signup" component={SignUp} google={google} facebook={facebook} email={email} />
    <Route path="/travelbuddies" component={TravelBuddies} />
    <Route path="/travelbuddies/email" component={InlineBuddyEdit} />
    <Route path='*' component={NotFound} />
  </Router>,
  document.getElementById('main')
)
