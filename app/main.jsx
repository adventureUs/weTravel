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

// Not sure if this is the right place to do this, but at least we'll be sure it gets run here.

// Some research in to some of the terminology: 

// * Domain Keys Identified Mail (DKIM) is an email authentication method designed to detect email spoofing. It allows the receiver to check that an email claimed to have come from a specific domain was indeed authorized by the owner of that domain.[1] It is intended to prevent forged sender addresses in emails, a technique often used in phishing and email spam.

// * Simple Mail Transfer Protocol (SMTP) is an Internet standard for electronic mail (email) transmission. First defined by RFC 821 in 1982, it was last updated in 2008 with Extended SMTP additions by RFC 5321, which is the protocol in widespread use today.

// Although electronic mail servers and other mail transfer agents use SMTP to send and receive mail messages, user-level client mail applications typically use SMTP only for sending messages to a mail server for relaying. For retrieving messages, client applications usually use either IMAP or POP3.

// SMTP communication between mail servers uses TCP port 25. Mail clients on the other hand, often submit the outgoing emails to a mail server on port 587. Despite being deprecated, mail providers sometimes still permit the use of nonstandard port 465 for this purpose.

// DigitalOcean is a cloud infrastructure provider

// A WebHook is an HTTP callback: an HTTP POST that occurs when something happens; a simple event-notification via HTTP POST. A web application implementing WebHooks will POST a message to a URL when certain things happen.

// Necessary to install/upgrade spamassasin? https://wiki.apache.org/spamassassin/SpamAssassin_on_Mac_OS_X_Server

// Domain Name Servers (DNS) are the Internet's equivalent of a phone book. They maintain a directory of domain names and translate them to Internet Protocol (IP) addresses. This is necessary because, although domain names are easy for people to remember, computers or machines, access websites based on IP addresses.

// A mail exchanger record (MX record) is a type of resource record in the Domain Name System that specifies a mail server responsible for accepting email messages on behalf of a recipient's domain, and a preference value used to prioritize mail delivery if multiple mail servers are available.

// A Records are the most basic type of DNS record and are used to point a domain or subdomain to an IP address. Assigning a value to an A record is as simple as providing your DNS management panel with an IP address to where the domain or subdomain should point and a TTL


// this code is from: https://github.com/Flolagale/mailin
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
