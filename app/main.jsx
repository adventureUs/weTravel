'use strict'
import React from 'react'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'
import {render} from 'react-dom'

// import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'
import Login from './components/Login'
import SignUp from './components/SignUp'
import DashboardIndex from './components/DashboardIndex'
import InlineBuddyEditIndex from './components/InlineBuddyEditIndex'

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

const App = () =>
  <div className="container-fluid">
  {
   firebase.auth().currentUser ? <Dashboard/> : <Login/>
  }
  </div>

render(
  <Router history={browserHistory}>
    <Route path="/" component={App} />
    <Route path="login" component={Login} google={google} facebook={facebook} email={email} />
    <Route path="dashboard" component={DashboardIndex} />
    <Route path="signup" component={SignUp} google={google} facebook={facebook} email={email} />
    <Route path="/travelbuddies/email" component={InlineBuddyEditIndex}/>
    <Route path='*' component={NotFound} />
  </Router>,
  document.getElementById('main')
)
