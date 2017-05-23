import React from 'react'
import { Link, browserHistory } from 'react-router'
import firebase from 'APP/fire'
const db = firebase.database()
const auth = firebase.auth()

const Logout = () => {
  auth.signOut()
  browserHistory.push('/login')
  return null
}

export default Logout
