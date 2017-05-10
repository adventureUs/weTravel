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
// loop over buddies in trip and grab info
// From trips (ie. tripsRef) we need: buddiesid -> id, buddiesid -> group, availabilityStart -> start_time, availabilityEnd -> end_time
//  From users (ie. userRef) we need: user name -> title
//  we have tripRef, userRef, usersRef passed in
let items = [
  {id: 'dlxw3BoFWJMfMpGoBlRhQsRAiMB2', group: 'dlxw3BoFWJMfMpGoBlRhQsRAiMB2', title: 'Tina', start_time: moment('Tue May 12 2017 12:51:11 GMT-0400'), end_time: moment('Tue May 16 2017 13:00:11 GMT-0400')},
  {id: 'n2JCRgwSVuPr1WzifDLia2Ti8gr1', group: 'n2JCRgwSVuPr1WzifDLia2Ti8gr1', title: 'Allison', start_time: moment('Tue May 11 2017 12:51:11 GMT-0400'), end_time: moment('Tue June 14 2017 13:00:11 GMT-0400')}
]

const db = firebase.database()

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startTime: moment(),
      endTime: moment().add(1, 'days')
    }
  }
  componentWillMount() {
    // Getting data from trip part of db
    let itemsData = []
    const tripRef = this.props.tripRef
    tripRef.on('value', function(snapshot) {
      const buddiesObject = snapshot.val().buddies
      const buddiesIds = Object.keys(buddiesObject)
      // now map over the buddies Ids and grab the start and end dates
      itemsData = Object.keys(buddiesObject).map((key) => {
        return {
          id: key,
          group: key,
          title: 'WILL GET IN A BIT',
          start_time: buddiesObject[key].availabilityStart,
          end_time: buddiesObject[key].availabilityEnd
        }
      })
    })
    console.log('***************ITEMSDATA?************:', itemsData)
    // Getting data from users part of db
    // map over the itemsData and grab the ids to find the users we need from the users in the db
    // Then we update the itemsData with the users name

    // const usersRef = this.props.usersRef
    // let items = itemsData.map((item) => {
    //   usersRef.on('value', function(snapshot) {
    //     const name = snapshot.val()[item.id].name
    //     return {id: item.id,
    //       group: item.group,
    //       title: name,
    //       start_time: item.start_time,
    //       end_time: item.end_time}
    //   })
    // })
    // console.log("***************ITEMS?************:", items)
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

  onItemResize = (itemId, time, edge) => {
    // we get back the itemId, the time changed to in unix number format and the edge that was changed
    // we then set the new time based on what it's changed to.
    console.log('ON ITEM RESIZE HANDLER, itemId: ', itemId, 'time: ', moment(time), 'edge: ', edge)
    if (edge === 'left') {
      let startTime = moment(time)
      items[0].start_time = startTime
      this.setState({startTime: startTime})
    } else {
      let endTime = moment(time)
      items[0].end_time = endTime
      this.setState({endTime: endTime})
      console.log('ON ITEM RESIZE HANDLER, itemEndTime: ', endTime)
    }
    console.log('ITEMS[0] AFTER SETTING END TIME: ', items[0])
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
