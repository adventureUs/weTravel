import React from 'react'
import { Link, browserHistory } from 'react-router'
import firebase from 'APP/fire'
import addToTrip from 'APP/src/addToTrip'
import redirectToTripZeroeth from 'APP/src/redirectToTripZeroeth'
import createNewUserAndTrip from 'APP/src/createNewUserAndTrip'

const auth = firebase.auth()

// Do external logins in Login

// If you want to request additional permissions, you'd do it
// like so:
//
// google.addScope('https://www.googleapis.com/auth/plus.login')
//
// What kind of permissions can you ask for? There's a lot:
//   https://developers.google.com/identity/protocols/googlescopes
//
// For instance, this line will request the ability to read, send,
// and generally manage a user's email:
//
// google.addScope('https://mail.google.com/')

export default class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      user: null
    }
  }
  componentDidMount() {
    // this.unsubscribe = auth && auth.onAuthStateChanged(user => user && this.setState({ user }))
    auth && this.setState({ user: auth.currentUser })
  }

  setEmailPassword = (evt) => {
    this.setState({ [evt.target.id]: evt.target.value })
  }

  emailSubmit = (evt) => {
    evt.preventDefault()
    if (this.state.email.length && this.state.password.length) {
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          // use auth to get currentUser Id,  look up userRef and get list of user trips.
          redirectToTripZeroeth(auth.currentUser.uid)
        })
        .catch(error => {
          window.alert(error)
        })
    } else {
      window.alert('Please fill in both your email and password')
    }
  }

  googleSubmit = (userCredential) => {
    const queryString = window.location.search
    // first case in ternary: there is a query string, and we go to that trip
    // second case in ternary: there is no query string, we need to check if the user has trips to go to
    queryString ? this.goToTrip(userCredential.user, queryString) : this.findAndGo(userCredential.user)
  }

  goToTrip = (user, queryString) => {
    var tripId = queryString.slice(1)
    // Check to see if this user is in the database
    firebase.database().ref('users')
      .once('value')
      .then(snapshot => {
        const userExists = snapshot.hasChild(user.uid)
        if (!userExists) {
          this.createNewUserWithTrip(user, tripId)
        } else {
          // the user DOES exist, but they might not have this trip in their trips list
          firebase.database().ref('trips')
            .child('buddies')
            .then(snapshot => {
              const userExistsOnTrip = snapshot.hasChild(user.uid)
              // the user already has this trip, and just needs to be redirected
              if (userExistsOnTrip) {
                browserHistory.push('/dashboard/' + queryString.slice(1))
                // the user does not yet exist on the trip and needs to be added to 'buddies'
              } else {
                addToTrip(user, queryString)
              }
            })
        }
      })
      .catch(err => console.error(err))
  }

  // Take an auth and make a user and add to previously existing trip:
  createNewUserWithTrip = (user, tripId) => {
    const userId = user.uid
    firebase.database().ref('users/').update({
      [userId]: {
        email: user.email,
        trips: [tripId]
      }
    })
      .then(() => {
        browserHistory.push('/dashboard/' + tripId)
      })
      .catch(error => {
        window.alert(error)
      })
  }
  // Check users for auth user and then:
  findAndGo = (user) => {
    // It is possible that they are erroneously trying to 'sign-up' from the login page using Google -- if so the user will not be in database users table and they won't have any trips
    // If they are using google login properly, they should exist in the users table and have at least one trip
    // first check to see if the user exists in the table
    firebase.database().ref('users')
      .once('value')
      .then(snapshot => {
        const userExists = snapshot.hasChild(user.uid)
        if (!userExists) {
          console.log('guess we got to make a new one!')
          createNewUserAndTrip(user)
        } else {
          redirectToTripZeroeth(user.uid)
        }
      })
  }

  render() {
    // const auth = this.props.route.auth
    const auth = firebase.auth()
    const google = new firebase.auth.GoogleAuthProvider()
    const email = new firebase.auth.EmailAuthProvider()

    return (
      <div id="background-div">
        <div className="jumbotron login-container" >
          <legend>Login</legend>
          <div>
            <button className='google login btn btn-primary'
              onClick={() => {
                // signInWithPopup will try to open a login popup, and if it's blocked, it'll redirect
                // If you prefer, you can signInWithRedirect, which always redirects.
                auth.signInWithPopup(google)
                .then((userCredential) => {
                  this.googleSubmit(userCredential)
                })
              }}>
              <img
                id="icon"
                src="http://diylogodesigns.com/blog/wp-content/uploads/2016/04/google-logo-icon-PNG-Transparent-Background.png"
                alt="googleIcon" />
              Login with Google
            </button>
          </div>
          <form onSubmit={this.emailSubmit}
                className="form-horizontal">
            <div className="or-divider">
              <span>Or</span>
            </div>
            <div className="form-group">
              <input type="text"
                     className="login form-control"
                     id="email"
                     placeholder="Email"
                     onChange={this.setEmailPassword} />
            </div>
            <div className="form-group">
              <input type="password"
                     className="form-control"
                     id="password"
                     placeholder="Password"
                     onChange={this.setEmailPassword} />
            </div>
            <div className="form-group">
              <button type="submit"
                      className="login btn btn-primary">
                <img
                  id="icon"
                  src="http://www.stickpng.com/assets/images/584856bce0bb315b0f7675ad.png" alt="emailIcon" />
                Login with Email
              </button>
            </div>
          </form>
          <div>
            <br />
          </div>
            <hr />
          <div>
            <legend>Create an account</legend>
            {
              window.location.search
                ?
                <div>New to adventureUs?
                  <Link to={'/signup' + window.location.search}>Sign up here!</Link>
                </div>
                :
                <div className='sign-up'>New to adventureUs? <Link to="/signup" >Sign up here.</Link></div>
            }
          </div>
        </div >
      </div>
    )
  }
}
