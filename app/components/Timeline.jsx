import React, { Component } from 'react'
import { Link } from 'react-router'
import firebase from 'APP/fire'
import Timeline from 'react-calendar-timeline'
import moment from 'moment'

const db = firebase.database()

export default class extends Component {
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
    const groups = [
      {id: 'dlxw3BoFWJMfMpGoBlRhQsRAiMB2', title: 'Tina'}
    ]

// this is where we make our connection to the database, we need:
// user name, user startDate for this trip, user endDate for this trip (currentTripUserStartDate, currentTripUserEndDate)
    const items = [
      {id: 'dlxw3BoFWJMfMpGoBlRhQsRAiMB2', group: 'dlxw3BoFWJMfMpGoBlRhQsRAiMB2', title: 'Tina', start_time: moment('Tue May 09 2017 12:51:11 GMT-0400'), end_time: moment('Tue May 16 2017 13:00:11 GMT-0400')}
    ]

    return (
      <div className="well">
        <h1>Timeline</h1>
          <Timeline groups={groups}
            items={items}
            defaultTimeStart={moment().add(-12, 'hour')}
            defaultTimeEnd={moment().add(12, 'hour')}
            />
      </div>
    )
  }
}

// Database structure
// db = {
// "TRIPS": {
//    "tripID_uniquelygeneratedbyFirebase": {
//      "USERS": {
//        "userID_uniquelygeneratedbyFirebase": {
//          "start_date_moment_instance_in_string_form",
//          "end_date_moment_instance_in_string_form"
//        }
//      }
//    }
//   }
// }
//
//{
    //   buddyTimelineData: {
    //     'dlxw3BoFWJMfMpGoBlRhQsRAiMB2': {
    //       currentTripUserName: 'Tina',
    //       currentTripUserStartDate: 'Tue May 09 2017 12:51:11 GMT-0400',
    //       currentTripUserEndDate: 'Tue May 16 2017 13:00:11 GMT-0400'
    //     }
    //   }
    // }
