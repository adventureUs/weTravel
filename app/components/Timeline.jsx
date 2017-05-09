import React, { Component } from 'react'
import { Link } from 'react-router'
import firebase from 'APP/fire'
import Timeline from 'react-calendar-timeline'
import moment from 'moment'

// dummy data, will pull in from db later
const groups = [
  {id: 'dlxw3BoFWJMfMpGoBlRhQsRAiMB2', title: 'Tina'},
  {id: 'n2JCRgwSVuPr1WzifDLia2Ti8gr1', title: 'Allison'}
]

// this is where we make our connection to the database, we need:
// user name, user startDate for this trip, user endDate for this trip (currentTripUserStartDate, currentTripUserEndDate)
const items = [
  {id: 'dlxw3BoFWJMfMpGoBlRhQsRAiMB2', group: 'dlxw3BoFWJMfMpGoBlRhQsRAiMB2', title: 'Tina', start_time: moment('Tue May 12 2017 12:51:11 GMT-0400'), end_time: moment('Tue May 16 2017 13:00:11 GMT-0400')},
  {id: 'n2JCRgwSVuPr1WzifDLia2Ti8gr1', group: 'n2JCRgwSVuPr1WzifDLia2Ti8gr1', title: 'Allison', start_time: moment('Tue May 11 2017 12:51:11 GMT-0400'), end_time: moment('Tue June 14 2017 13:00:11 GMT-0400')}
]

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

  findMinStartDate = (items) => {
    // takes start dates from each buddy and returns the min of these minus 1 day in unix number form casts from 1970 ('* 1000')
    let tempMinDate = items.map(item => item.start_time)
    .reduce((minDate, dateMoment) => { return dateMoment < minDate ? dateMoment : minDate }, moment().add(10, 'years'))
    let renderMinStartDate = moment(tempMinDate).add(-1, 'days')
    return renderMinStartDate.unix()*1000
  }

  findMaxEndDate = (items) => {
    // takes end dates from each buddy and returns the max of these minus 1 day in unix number form and casts from 1970 ('* 1000')
    let tempMaxDate = items.map(item => item.end_time)
    .reduce((maxDate, dateMoment) => { return dateMoment > maxDate ? dateMoment : maxDate }, moment())
    let renderMaxEndDate = moment(tempMaxDate).add(1, 'days')
    return renderMaxEndDate.unix()*1000
  }
  onItemClick = (itemId, e) => {
    // returns the id of the item selected
    console.log('ON ITEM CLICK HANDLER, itemId: ', itemId, 'e: ', e)
  }
  onItemSelect = (itemId, e) => {
    // returns the id of the item selected
    console.log('ON ITEM SELECT HANDLER, itemId: ', itemId, 'e: ', e)
  }
  onItemResize = (itemId,time,edge) => {
    console.log('ON ITEM RESIZE HANDLER, itemId: ', itemId, 'time: ', time, 'edge: ', edge)
    // we get back the itemId, the time changed to in unix number format and the edge that was changed
  }
  render() {
// This object sets the untis on the timeline.
// Currently, it is set to display days, months and years
    const timeSteps = {
      second: 0,
      minute: 0,
      hour: 0,
      day: 1,
      month: 1,
      year: 1
    }

    return (
      <div className="well">
        <h1>Timeline</h1>
          <Timeline groups={groups}
            items={items}
            defaultTimeStart={moment().add(-12, 'hour')}
            defaultTimeEnd={moment().add(12, 'hour')}
            timeSteps={timeSteps}
            visibleTimeStart={this.findMinStartDate(items)}
            visibleTimeEnd={this.findMaxEndDate(items)}
            sidebarWidth={70}
            onItemClick={this.onItemClick}
            onItemSelect={this.onItemSelect}
            onItemResize={this.onItemResize}
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
// {
    //   buddyTimelineData: {
    //     'dlxw3BoFWJMfMpGoBlRhQsRAiMB2': {
    //       currentTripUserName: 'Tina',
    //       currentTripUserStartDate: 'Tue May 09 2017 12:51:11 GMT-0400',
    //       currentTripUserEndDate: 'Tue May 16 2017 13:00:11 GMT-0400'
    //     }
    //   }
    // }
