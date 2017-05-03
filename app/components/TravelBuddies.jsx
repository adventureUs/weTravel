import React, { Component } from 'react'
import {Route} from 'react-router'
import DatePicker from 'react-datepicker'

import moment from 'moment'
import firebase from 'APP/fire'
const db = firebase.database

const TravelBuddies = () => (

      <div>
        <h1>BUDDIES</h1>
        <div className="container">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>HomeBase</th>
                <th>Available Dates</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Name from DB
                </td>
                <td>
                  Email from DB
                </td>
                <td>
                  Status from DB
                </td>
                <td>
                 HomeBase from DB
                </td>
                <td>
                  Start Date from DB
                </td>
                <td>
                 End Date from DB
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )

export default TravelBuddies
