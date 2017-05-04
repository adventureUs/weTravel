import React from 'react'
import {Link} from 'react-router'
import firebase from 'APP/fire'
const auth = firebase.auth()

export default class extends React.Component {
  componentDidMount() {
    // const {auth} = this.props
    // this.unsubscribe = auth.onAuthStateChanged(user => this.setState({user}))
  }

  componentWillUnmount() {
    // this.unsubscribe()
  }

  render() {
    console.log('FROM DASHBOARD.  USER: ', auth.currentUser)
    return <div className='well'>
            <h1>Dashboard Under Construction</h1>
            <h4>{auth.currentUser ? `${auth.currentUser.email}` : 'No one'} is signed in</h4>
            <Link to="/login"><button className='logout' onClick={() => auth.signOut()}>logout</button></Link>
            </div>
  }
}
