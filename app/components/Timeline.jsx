import React, { Component } from 'react'
import { Link } from 'react-router'
import ReactTooltip from 'react-tooltip'
import firebase from 'APP/fire'
import Timeline from 'react-calendar-timeline'
import moment from 'moment'

// this is where we make our connection to the database, we need:
// user name, user startDate for this trip, user endDate for this trip (currentTripUserStartDate, currentTripUserEndDate)
// loop over buddies in trip and grab info
// From trip (ie. tripRef) we need: buddiesid -> id, buddiesid -> group, availabilityStart -> start_time, availabilityEnd -> end_time
// Note: title in an itemsData group will be the name of a buddy or self

const db = firebase.database()

export default class AdventureUsTimeline extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startTime: moment(),
      endTime: moment().add(1, 'days'),
    }
    this.onItemResize = this.onItemResize.bind(this)
  }
  componentWillMount() {

  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  findMinStartDate = (items) => {
    // takes start dates from each buddy and returns the min of these minus 1 day in unix number form casts from 1970 ('* 1000')
    const tempMinDate = items.map(item => item.start_time)
    .reduce((minDate, dateMoment) => {
      return dateMoment < minDate ? dateMoment : minDate
    }, moment().add(10, 'years'))
    const renderMinStartDate = moment(tempMinDate).add(-1, 'days')
    return moment(renderMinStartDate.unix()*1000)
  }

  findMaxEndDate = (items) => {
    // takes end dates from each buddy and returns the max of these minus 1 day in unix number form and casts from 1970 ('* 1000')
    const tempMaxDate = items.map(item => item.end_time)
    .reduce((maxDate, dateMoment) => {
      return dateMoment > maxDate ? dateMoment : maxDate
    }, moment())
    const renderMaxEndDate = moment(tempMaxDate).add(1, 'days')
    return moment(renderMaxEndDate.unix()*1000)
  }

  onItemResize = (itemId, time, edge) => {
    const branch = this.props.whichTab === 'Buddies' ? 'buddies' : 'ideas'
    const tripRef = this.props.tripRef || 'test'
    // we get back the itemId, the time changed to in unix number format and the edge that was changed
    // we then set the new time based on what it's changed to.
    const itemArrayIndex = this.props.items.findIndex((item) => item.id === itemId)
    if (edge === 'left') {
      const startTime = moment(time)
      // loop through item array and find the item where the id matches the itemId, then update the startTime here
      this.props.items[itemArrayIndex].start_time = startTime
      this.findMinStartDate(this.props.items)
      this.setState({startTime: startTime})
      tripRef.child(`${branch}/${itemId}`).update({startDate: startTime.toJSON()})
    } else {
      const endTime = moment(time)
      this.props.items[itemArrayIndex].end_time = endTime
      this.findMaxEndDate(this.props.items)
      this.setState({endTime: endTime})
      tripRef.child(`${branch}/${itemId}`).update({endDate: endTime.toJSON()})
    }
  }

  render() {
    let minDate = this.findMinStartDate(this.props.items).unix()*1000
    let maxDate = this.findMaxEndDate(this.props.items).unix()*1000
    // console.log('date in render', this.findMinStartDate(this.props.items).unix()*1000)

// This object sets the untis on the timeline.
// Currently, it is set to display days, months and years
    // console.log('TIMELINE, PROPS', this.props)
    const timeSteps = {
      second: 0,
      minute: 0,
      hour: 0,
      day: 1,
      month: 1,
      year: 1
    }

    // ref is not the ideal fix, but it renders the items on the timeline correctly
    return (
      <div>
        <span className="glyphicon glyphicon-info-sign"
              data-event='click focus'
              data-tip="Timeline items can be selected and resized">
        </span>
        <ReactTooltip globalEventOff='click'/>
          <div data-event='click focus'
                data-tip=""
                place="top"
                effect="solid">
            <Timeline groups={this.props.groups}
              ref= {(timeline) => timeline && timeline.updateScrollCanvas(minDate, maxDate)}
              items={this.props.items}
              visibleTimeStart={this.findMinStartDate(this.props.items).unix()*1000}
              visibleTimeEnd={this.findMaxEndDate(this.props.items).unix()*1000}
              timeSteps={timeSteps}
              sidebarWidth={70}
              onItemResize={this.onItemResize}
              stackItems={true}
              />
          </div>
          <ReactTooltip globalEventOff='click'/>
      </div>
    )
  }
}

// commented below line out from div above <Timeline>
// ** believe was for ReactTooltips
// data-event='click focus'

// visibleTimeStart={this.findMinStartDate(this.props.items)}
//          visibleTimeEnd={this.findMaxEndDate(this.props.items)}

// defaultTimeStart={this.findMinStartDate(this.props.items)}
//             defaultTimeEnd={this.findMaxEndDate(this.props.items)}
