import React, { Component } from 'react'
import { Link } from 'react-router'
import firebase from 'APP/fire'
import Timeline from 'react-calendar-timeline'
import moment from 'moment'



// dummy data, will pull in from db later
let groups = []

// this is where we make our connection to the database, we need:
// user name, user startDate for this trip, user endDate for this trip (currentTripUserStartDate, currentTripUserEndDate)
// loop over buddies in trip and grab info
// From trips (ie. tripsRef) we need: buddiesid -> id, buddiesid -> group, availabilityStart -> start_time, availabilityEnd -> end_time
//  From users (ie. userRef) we need: user name -> title
//  we have tripRef, userRef, usersRef passed in
let items = []

const db = firebase.database()

export default class AdventureUsTimeline extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startTime: moment(),
      endTime: moment().add(1, 'days'),
      items: []
    }
  }
  componentWillMount() {
    // Getting data from trip part of db
    let itemsData = [], groupData = []
    const tripRef = this.props.tripRef
    tripRef.on('value', function(snapshot) {
      const buddiesObject = snapshot.val().buddies
      const buddiesIds = Object.keys(buddiesObject)
      // now map over the buddies Ids and grab the start and end dates
      itemsData = Object.keys(buddiesObject).map((key) => {
        return {
          id: key,
          group: key,
          title: buddiesObject[key].buddyName,
          start_time: moment(buddiesObject[key].availabilityStart),
          end_time: moment(buddiesObject[key].availabilityEnd)
        }
      })
      groupData = Object.keys(buddiesObject).map((key) => {
        return {
          id: key,
          title: buddiesObject[key].buddyName
        }
      })
      groups = groupData
      items = itemsData
    })
  }

  componentDidMount() {

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
    const tripRef = this.props.tripRef
    // we get back the itemId, the time changed to in unix number format and the edge that was changed
    // we then set the new time based on what it's changed to.
    if (edge === 'left') {
      let startTime = moment(time)
      items[0].start_time = startTime
      this.setState({startTime: startTime})
      tripRef.child(`buddies/${itemId}`).update({availabilityStart: startTime.toJSON()})
    } else {
      let endTime = moment(time)
      items[0].end_time = endTime
      this.setState({endTime: endTime})
      tripRef.child(`buddies/${itemId}`).update({availabilityEnd: endTime.toJSON()})
    }
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

