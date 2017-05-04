import React, { Component } from 'react'
import { Link } from 'react-router'
import firebase from 'APP/fire'

const db = firebase.database()

const Timeline = () =>
  (
    <div className="jumbotron">
      <h1>Timeline</h1>
      <p>Under Contruction.  Please come back later!</p>
      <p><a className="btn btn-primary btn-lg">Will convert to a slider</a></p>
    </div>
  )

export default Timeline
