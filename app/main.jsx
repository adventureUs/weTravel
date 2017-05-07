'use strict'
import React from 'react'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'
import {render} from 'react-dom'

// import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'
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
    <Route path="dashboard" component={Dashboard} />
    <Route path="signup" component={SignUp} google={google} facebook={facebook} email={email} />

    <Route path="/travelbuddies/email" component={InlineBuddyEditIndex}/>

    <Route path='*' component={NotFound} />
  </Router>,
  document.getElementById('main')
)


var mailin = require('mailin');
    
/* Start the Mailin server. The available options are:
 *  options = {
 *     port: 25,
 *     webhook: 'http://mydomain.com/mailin/incoming,
 *     disableWebhook: false,
 *     logFile: '/some/local/path',
 *     logLevel: 'warn', // One of silly, info, debug, warn, error
 *     smtpOptions: { // Set of options directly passed to simplesmtp.createServer(smtpOptions)
 *        SMTPBanner: 'Hi from a custom Mailin instance'
 *     }
 *  };
 * Here disable the webhook posting so that you can do what you want with the
 * parsed message. */
mailin.start({
  port: 25,
  disableWebhook: true // Disable the webhook posting.
});

/* Access simplesmtp server instance. */
mailin.on('authorizeUser', function(connection, username, password, done) {
  if (username == "johnsmith" && password == "mysecret") {
    done(null, true);
  } else {
    done(new Error("Unauthorized!"), false);
  }
});

/* Event emitted when a connection with the Mailin smtp server is initiated. */
mailin.on('startMessage', function (connection) {
  /* connection = {
      from: 'sender@somedomain.com',
      to: 'someaddress@yourdomain.com',
      id: 't84h5ugf',
      authentication: { username: null, authenticated: false, status: 'NORMAL' }
  }
  }; */
  console.log(connection);
});

/* Event emitted after a message was received and parsed. */
mailin.on('message', function (connection, data, content) {
  console.log(data);
  /* Do something useful with the parsed message here.
   * Use parsed message `data` directly or use raw message `content`. */
});
    