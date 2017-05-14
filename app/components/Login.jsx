import React from 'react'
import { Link, browserHistory } from 'react-router'
import firebase from 'APP/fire'
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
    this.unsubscribe = auth && auth.onAuthStateChanged(user => this.setState({ user }))
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  setEmailPassword = (evt) => {
    this.setState({ [evt.target.id]: evt.target.value })
  }

  onSubmit = (evt) => {
    // console.log('STATE in LOGIN:', this.state)
    evt.preventDefault()
    // what we actually want to do is redirect to the dashboard view
    if (this.state.email.length && this.state.password.length) {
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          // use auth to get currentUser Id,  look up userRef and get list of user trips.
          // UNDER CONSTRUCTION HERE: WANTED TO COMMENT OUT PREVENT DEFAULT NEXT.

          this.unsubscribe = auth.onAuthStateChanged(user => {
            // this.setState({userId: user.uid})
            firebase.database().ref('users')
              .child(user.uid)
              .child('trips')
              .once('value')
              .then(snapshot => {
                const tripsArr = snapshot.val()
                if (tripsArr.length === 1) {
                  return tripsArr[0]
                }
              })
              .then((tripId) => browserHistory.push('/dashboard/' + tripId))
          })
        })
        .catch(error => {
          window.alert(error)
        })
    } else {
      window.alert('Please fill in both your email and password')
    }
  }

  googleSubmit = (userCredential) => {
    // console.log('MADE IT TO GOOGLE SUBMIT, here is the credential', userCredential)
    const queryString = window.location.search
    queryString ? this.goToTrip(userCredential.user, queryString) : this.findAndGo(userCredential.user)
  }

  goToTrip = (user, queryString) => {
    // console.log('MADE IT TO GO TO TRIP', queryString)
    var tripId = queryString.slice(1)
    // Check to see if this user is in the database
    firebase.database().ref('users')
      .once('value')
      .then(snapshot => {
        const userExists = snapshot.hasChild(user.uid)
        // console.log('does this user exist in the db?', userExists)
        if (!userExists) {
          // console.log('guess we got to make a new one!')
          this.createNewUserWithTrip(user, tripId)
        } else {
          browserHistory.push('/dashboard/' + queryString.slice(1))
        }
      })
      .catch(err => console.error(err))
    // might have to add some additional logic -- if they are erroneously logging in (instead of signing in) for the first time to a trip they were invited to, we have to do some of the trips/buddies updating here too
  }

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

  findAndGo = (user) => {
    // console.log('MADE IT TO FIND AND GO TO TRIP, here is the user Id', user.uid)

    // It is possible that they are erroneously trying to 'sign-up' from the login page using Google -- if so the user will not be in database users table and they won't have any trips
    // If they are using google login properly, they should exist in the users table and have at least one trip
    // first check to see if the user exists in the table
    firebase.database().ref('users')
      .once('value')
      .then(snapshot => {
        const userExists = snapshot.hasChild(user.uid)
        // console.log('does this user exist in the db?', userExists)
        if (!userExists) {
          console.alert('guess we got to make a new one!')
          this.createNewUserAndTrip(user)
        } else {
          firebase.database().ref('users')
            .child(user.uid)
            .child('trips')
            .once('value')
            .then(snapshot => {
              // console.log('FOUND THE TRIPS:', snapshot.val())
              // trips is an Array, currently with only one item in it
              const trips = snapshot.val()
              browserHistory.push('/dashboard/' + trips[0])
            })
            .catch(err => console.error(err))
        }
      })
  }

  createNewUserAndTrip = (user) => {
    const userId = user.uid
    // console.log('GOT INTO CREATE-NEW-TRIP', userId)

    // first creates new trip data and key and updates trip table
    var newTripKey = firebase.database().ref('trips/').push().key
    // this.setState({ tripId: newTripKey })
    var newTripData = {
      tripName: 'Please Name Your Trip Here!',
      buddies: {
        [userId]: {
          status: { id: '2', text: 'Going' }
        }
      }
    }
    var newTrip = {}
    newTrip[newTripKey] = newTripData
    firebase.database().ref('trips/').update(newTrip)

    // then in users table, creates a new user with with new trip key
    firebase.database().ref('users/').update({
      [userId]: {
        email: user.email,
        trips: [newTripKey]
      }
    })
      // concerned about this then
      .then(() => {
        browserHistory.push('/dashboard/' + newTripKey)
      })
      .catch(error => {
        window.alert(error)
      })
  }

  render() {
    // const auth = this.props.route.auth
    const auth = firebase.auth()
    const google = new firebase.auth.GoogleAuthProvider()
    const email = new firebase.auth.EmailAuthProvider()

    // console.log('PROPS from login', this.props)
    return (
      <div id="background-div">
        <div className="jumbotron login-container" >
          <form onSubmit={this.onSubmit} className="form-horizontal">
            <legend>Login</legend>
            <div>
              <button className='google login btn btn-primary'
                onClick={() => {
                  // signInWithPopup will try to open a login popup, and if it's blocked, it'll
                  // redirect. If you prefer, you can signInWithRedirect, which always
                  // redirects.
                  auth.signInWithPopup(google)
                    // .then(() => {
                    //   window.location.search ?
                    //     browserHistory.push('/dashboard/' + window.location.search.slice(1))
                    //     // : browserHistory.push('/dashboard') // eventually needs to grab tripId to render dashboard properyly
                    //     : console.log("OOPS")
                    // })
                    .then((userCredential) => {
                      // console.log('THE RES', userCredential)
                      this.googleSubmit(userCredential)
                    })
                }}>
                <img
                  id="icon"
                  src="http://diylogodesigns.com/blog/wp-content/uploads/2016/04/google-logo-icon-PNG-Transparent-Background.png" alt="googleIcon" />
                Sign in with Google
            </button>
            </div>
            <div className="or-divider">
              <span>Or</span>
            </div>
            <div className="form-group">
              <input type="text" className="login form-control" id="email" placeholder="Email" onChange={this.setEmailPassword} />
            </div>
            <div className="form-group">
              <input type="password" className="form-control" id="password" placeholder="Password" onChange={this.setEmailPassword} />
            </div>
            <div className="form-group">
              <button type="submit"
                className="login btn btn-primary">
                <img
                  id="icon"
                  src="http://www.stickpng.com/assets/images/584856bce0bb315b0f7675ad.png" alt="emailIcon" />
                Sign in with Email
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
              window.location.search ?
                <div>New to adventureUs? <Link to={'/signup' + window.location.search}>Sign up here!</Link></div>
                // : browserHistory.push('/dashboard') // eventually needs to grab tripId to render dashboard properyly
                : <div className='sign-up'>New to adventureUs? <Link to="/signup" >Sign up here.</Link></div>
            }
          </div>
        </div >
      </div>
    )
  }
}
