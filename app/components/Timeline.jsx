import React, { Component } from 'react'
import { Link } from 'react-router'
import firebase from 'APP/fire'

const db = firebase.database()

export default class Timeline extends React.Component {
  constructor(props) {
    super(props)
    this.state
  }
  componentWillMount() {
    // const auth = this.props.route.auth
    // this.unsubscribe = auth && auth.onAuthStateChanged(user => this.setState({user}))
  }

  componentWillUnmount() {
    // this.unsubscribe && this.unsubscribe()
  }
  render() {
    return (
      <div className="well">
        <h1>Timeline</h1>
        <p>Under Contruction.  Please come back later!</p>
        <p><a className="btn btn-primary btn-lg">Will convert to a slider</a></p>
      </div>
    )
  }
}
