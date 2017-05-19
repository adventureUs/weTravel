'use strict'
import React from 'react'
import { Router, Route, IndexRedirect, browserHistory, Link } from 'react-router'
import { render } from 'react-dom'

// import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'
import Login from './components/Login'
import SignUp from './components/SignUp'
import App from './components/App'
import InlineBuddyEditIndex from './components/InlineBuddyEditIndex'
import Logout from './components/Logout'
import firebase from 'APP/fire'
import redirectToTripZeroeth from 'APP/src/redirectToTripZeroeth'
// ---- UNCOMMENT TO RESEED DATABASE ----------
// import {trips, users} from '../seedData'
// console.log('USERS', users, 'TRIPS', trips)
// firebase.database().ref('trips/').set(trips)
// firebase.database().ref('users/').set(users)

// Get the auth API from Firebase.
const auth = firebase.auth()
const google = new firebase.auth.GoogleAuthProvider()
const email = new firebase.auth.EmailAuthProvider()
// Deleted facebook --> can reimplement if we have time, hahahahhaahahaahhah

//
export default class LandingPage extends React.Component {
  componentWillMount() {
    // setTimeout(() => browserHistory.push('/login'), 300)
    this.unsubscribe = auth.onAuthStateChanged(user => {
      // console.log('LandingPage COMPONENT_WILL_MOUNT, USER: ', user)
      if (user) redirectToTripZeroeth(user.uid)
    })
  }
  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  render() {
    // console.log('LandingPage in MAIN, currentUser', firebase.auth().currentUser)

    return (
      <div className='jumbotron landing-container landingPageText'>
        <div>Welcome to adventureUs, a place where you can meet up with your buddies and plan your next great adventure together!</div>
        <div className='landingPageButtons'>
          <Link to='/login'><button className='btn btn-primary landing'>Log In</button></Link>
          <Link to='/signup'><button className='btn btn-primary landing'>Sign Up</button></Link>
        </div>
      </div>
    )
  }
}

function onTripEnter({params: {tripId}}, replace, next) {
  setTimeout(() => {
    unsubscribe()
    replace('/login?' + tripId)
    next()
  }, 300)
  const unsubscribe = auth.onAuthStateChanged(user => {
    // console.log('LandingPage COMPONENT_WILL_MOUNT, USER: ', user)
    if (user) {
      unsubscribe()
      next()
    }
  })
}

render(
  <Router history={browserHistory}>
    <Route path="/" component={LandingPage} />
    <Route path="login" component={Login} google={google} email={email} />
    <Route path="dashboard/:tripId" component={App} onEnter={onTripEnter}/>
    <Route path="signup" component={SignUp} google={google} email={email} />
    <Route path="/travelbuddies/email" component={InlineBuddyEditIndex} />
    <Route path='/logout' component={Logout} />
    <Route path='*' component={NotFound} />
  </Router>,
  document.getElementById('main')
)
