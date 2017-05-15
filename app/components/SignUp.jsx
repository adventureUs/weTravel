import React from 'react'
import { Link, browserHistory } from 'react-router'
import firebase from 'APP/fire'
import addToTrip from 'APP/src/addToTrip'
import createNewUserAndTrip from 'APP/src/createNewUserAndTrip'
const db = firebase.database()
const userRef = db.ref('users/')

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      confirmPassword: ''
    }
  }

  setEmailPassword = (evt) => {
    this.setState({ [evt.target.id]: evt.target.value })
  }

  googleSubmit = (userCredential) => {
    // console.log('MADE IT TO GOOGLE SUBMIT, here is the credential', userCredential)
    // First case in ternary is if user signs on with a pending buddy link to a trip
    // Second case in ternary is if a user signs on without a pending buddy link to a trip, so a new trip will be created
    const queryString = window.location.search
    queryString ? addToTrip(userCredential.user, queryString) : createNewUserAndTrip(userCredential.user)
  }

  confirmPasswordsMatch = () => {
    if (this.state.password !== this.state.confirmPassword) {
      window.alert('The passwords you submitted do not match. Please try again.')
      this.refs.password.value = ''
      this.refs.confirmPassword.value = ''
      this.setState({
        password: '',
        confirmPassword: ''
      })
      return false
    } else {
      return true
    }
  }

  emailSubmit = (evt) => {
    evt.preventDefault()
    // First confirm email and password & confirm password are all entered
    if (this.state.email.length && this.state.password.length && this.state.confirmPassword) {
      // confirmPasswordsMatch function return a boolean, true if they match, false if not
      if (this.confirmPasswordsMatch()) {
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then((user) => {
            const queryString = window.location.search
            queryString ? addToTrip(user, queryString) : createNewUserAndTrip(user)
          })
      }
    } else {
      window.alert('Please fill in both your email and password')
    }
  }

  // emailSubmit = (evt) => {
  //   evt.preventDefault()
  //   // console.log('MADE IT TO ON SUBMIT')
  //   // First confirm the passwords match
  //   // confirmPasswordsMatch function return a boolean, true if they match, false if not
  //   if (this.confirmPasswordsMatch()) {
  //     const queryString = window.location.search
  //     if (this.state.email.length && this.state.password.length) {
  //       firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
  //         .then((user) => {
  //           queryString ? addToTrip(user, queryString) : createNewUserAndTrip(user)
  //         })
  //     } else {
  //       window.alert('Please fill in both your email and password')
  //     }
  //   }
  // }

  redirectToLogin = (e) => {
    e.preventDefault()
    // console.log('HIT THE REDIRECT')
    browserHistory.push('/login/' + window.location.search)
  }

  render() {
    const auth = firebase.auth()
    const google = new firebase.auth.GoogleAuthProvider()
    const email = new firebase.auth.EmailAuthProvider()
    // console.log('STATE, look at tripID', this.state)
    return (
      <div id="background-div">
        <div className="jumbotron login-container">
          <form onSubmit={this.emailSubmit}
            className="form-horizontal">
            <legend>Sign up</legend>
            <div> Welcome to adventureUs, a place where you can meet up with your buddies and plan your next great adventure! Already have an account?
            <a onClick={this.redirectToLogin} href="">  Sign in.</a>
            </div>
            <hr />
            <div className="form-group">
              <div>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Email"
                  onChange={this.setEmailPassword} />
              </div>
            </div>
            <div className="form-group">
              <div>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  ref="password"
                  onChange={this.setEmailPassword} />
              </div>
            </div>
            <div className="form-group">
              <div>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  ref="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={this.setEmailPassword} />
              </div>
            </div>
            <div className="form-group">
              <div>
                <button type="submit"
                  className='login btn btn-primary'>
                  <img
                    id="icon"
                    src="http://www.stickpng.com/assets/images/584856bce0bb315b0f7675ad.png" alt="emailIcon" />
                  Sign up with Email</button>
              </div>
            </div>
          </form>
          <div className="or-divider">
            <span>Or</span>
          </div>
          <div>
            <button className='google login btn btn-primary'
              onClick={() => {
                auth.signInWithPopup(google)
                  // this is problematic, since you NEED a parametrized dashboard
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
              Sign up with Google
                  </button>
          </div>
        </div>
      </div>
    )
  }
}
