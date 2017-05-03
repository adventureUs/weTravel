import React from 'react'
import firebase from 'APP/fire'
const auth = firebase.auth()

import Login from './Login'

export const greeting = user => {
  if (!user || user.isAnonymous) return <h3>Please sign in below!</h3>
  return `Hello, ${{user.displayName || user.email}}.`
}

export const WhoAmI = ({user, auth}) =>
  <div className="whoami well">
    <span className="whoami-user-name">{greeting(user)}</span>
    { // If nobody is logged in, or the current user is anonymous,
      (!user)?
      // ...then show signin links...
      <div>
        <Login auth={auth}/>
      </div>
      /// ...otherwise, show a logout button.
      : <button className='logout' onClick={() => auth.signOut()}>logout</button> }
  </div>

export default class extends React.Component {
  componentDidMount() {
    const {auth} = this.props
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({user}))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const {user} = this.state || {}
    return <WhoAmI user={user} auth={auth}/>
  }
}
