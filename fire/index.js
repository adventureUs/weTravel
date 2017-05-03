const firebase = require('firebase')

// -- // -- // -- // Firebase Config // -- // -- // -- //
const config = {
  apiKey: "AIzaSyAnYp3yZT0JJEqJBSQ8wLqRzQYlsMEe-Ow",
  authDomain: "tern-2b37d.firebaseapp.com",
  databaseURL: "https://tern-2b37d.firebaseio.com",
  projectId: "tern-2b37d",
  storageBucket: "tern-2b37d.appspot.com",
  messagingSenderId: "852831908011"
}
// -- // -- // -- // -- // -- // -- // -- // -- // -- //

// Initialize the app, but make sure to do it only once.
//   (We need this for the tests. The test runner busts the require
//   cache when in watch mode; this will cause us to evaluate this
//   file multiple times. Without this protection, we would try to
//   initialize the app again, which causes Firebase to throw.
//
//   This is why global state makes a sad panda.)
firebase.__bonesApp || (firebase.__bonesApp = firebase.initializeApp(config))

module.exports = firebase
