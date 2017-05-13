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
    browserHistory.push('/dashboard/' + queryString.slice(1))
  }

  findAndGo = (user) => {
    // console.log('MADE IT TO FIND AND GO TO TRIP, here is the user Id', user.uid)
    // First check to see if this user does in fact already exist in the users datatable
    // It is possible that they are erroneously trying to 'sign-up' from the login page using Google
    const userExists = firebase.database().ref('users')
      .once('value')
      .then(snapshot => snapshot.hasChild(user.uid))
      .catch(err => console.error(err))
    userExists ?
      // If there is -- find their tripId (assuming there is only one)
      firebase.database().ref('users').child(user.uid).child('trips')
        .once('value')
        .then(snapshot => {
          console.log('FOUND THE TRIPS:', snapshot.val())
          // trips is an Array, currently with only one item in it
          const trips = snapshot.val()
          browserHistory.push('/dashboard/' + trips[0])
        })
      // If not create -- follow the same creation as is found in Sign.up jsx
      :
      console.log('YOU DONT EXIST YET')
  }

  render() {
    // const auth = this.props.route.auth
    const auth = firebase.auth()
    const google = new firebase.auth.GoogleAuthProvider()
    const email = new firebase.auth.EmailAuthProvider()

    // console.log('PROPS from login', this.props)
    return (
      <div className="jumbotron">
        <form onSubmit={this.onSubmit} className="form-horizontal">
          <legend className="col-lg-12" >Login with your email & password</legend>
          <div className="form-group">
            <label htmlFor="inputEmail" className="col-lg-2 control-label">Email</label>
            <div className="col-lg-10">
              <input type="text" className="form-control" id="email" placeholder="Email" onChange={this.setEmailPassword} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="inputPassword" className="col-lg-2 control-label">Password</label>
            <div className="col-lg-10">
              <input type="password" className="form-control" id="password" placeholder="Password" onChange={this.setEmailPassword} />
            </div>
          </div>
          <div className="form-group">
            <div className="col-lg-10 col-lg-offset-2">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </div>
        </form>
        <div>
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
              }}>Login with Google</button>
          </div>
          <br />
        </div>

        <hr />

        <div>
          {
            window.location.search ?
              <Link to={'/signup' + window.location.search}><button className='btn btn-success'>Sign Up</button></Link>
              // : browserHistory.push('/dashboard') // eventually needs to grab tripId to render dashboard properyly
              : <Link to="/signup"><button className='btn btn-success'>Sign Up</button></Link>
          }
        </div>
      </div >
    )
  }
}
