import React, { Component } from 'react'
import { Link } from 'react-router'
import firebase from 'APP/fire'

const db = firebase.database()

const Timeline = () =>
  (
    <div class="jumbotron">
      <h1>Timeline</h1>
      <p>Under Contruction.  Please come back later!</p>
      <p><a class="btn btn-primary btn-lg">Will convert to a slider</a></p>
    </div>
  )

export default Timeline
