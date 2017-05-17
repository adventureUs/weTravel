import React from 'react'
import { Route } from 'react-router'
import firebase from 'APP/fire'
const db = firebase.database()
import AdventureUsTimeline from './Timeline'
import moment from 'moment'

// this is where we make our connection to the database, we need:
// user name, user startDate for this trip, user endDate for this trip (currentTripUserStartDate, currentTripUserEndDate)
// loop over buddies in trip and grab info
// From trip (ie. tripRef) we need: buddiesid -> id, buddiesid -> group, availabilityStart -> start_time, availabilityEnd -> end_time
// Note: title in an bodyData group will be the name of a buddy or self

export default class TimelineIndex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      groups: [],
      items: []
    }
  }
  componentDidMount() {
    this.props.whichTab && this.props.whichTab === 'Buddies' ?
      this.listenFor('buddies') // For Buddies Slider Timelne View
      :
      this.listenFor('ideas') // For Ideas Box Timeline View
  }
  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }
  componentWillReceiveProps(nextProps) {
    // console.log('TIMELINE_INDEX Will RECEIVE PROPS', this.props)
    nextProps.whichTab && nextProps.whichTab === 'Buddies' ?
      this.listenFor('buddies') // For Buddies Slider Timelne View
      :
      this.listenFor('ideas') // For Ideas Box Timeline View
  }
  listenFor(branch) {
    if (this.unsubscribe) this.unsubscribe()
    /* HACK courtesy Tina: the following listener in a setTimeout is a hack.
      It ensures initial rendering of the timeline data.
      The data was always there but only showed as soon as we did anything to the view */
    // setTimeout(() => {

    const listener = this.props.tripRef.on('value', snapshot => {
      let result // of getting branch data
      if (branch === 'buddies') {
        result = this.buddiesData(snapshot)
      } else {
        result = this.ideasData(snapshot)
      }
      // console.log('in listenFor', branch, result)
      this.setState({
        groups: result.namesData,
        items: result.bodyData
      })
    })
    this.unsubscribe = () => this.props.tripRef.off('value', listener)
    // }, 10)
  }
  buddiesData(snapshot) {
    let bodyData = [], namesData = []
    if (snapshot.val() && snapshot.val()['buddies']) {
      const dbObject = snapshot.val()['buddies']
      const branchIds = Object.keys(dbObject)
      bodyData = branchIds.map(key =>
        ({
          id: key,
          group: key,
          title: dbObject[key].status.text,
          start_time: moment(dbObject[key].startDate),
          end_time: dbObject[key].endDate ? moment(dbObject[key].endDate) : moment().add(1, 'days'),
          canResize: key === this.props.userId ? 'both' : false,
          canChangeGroup: false
        })
      )
      namesData = branchIds
        .map((key) => ({id: key, title: dbObject[key].name}))
    }
    return {bodyData, namesData}
  }
  ideasData(snapshot) {
    let bodyData = [], namesData = []
    const dbObject = snapshot.val()['ideas']
    const branchIds = dbObject? Object.keys(dbObject) : []
    if (dbObject) {
      bodyData = branchIds.map(key =>
        ({
          id: key,
          group: dbObject[key].category.text,
          title: dbObject[key].ideaName,
          start_time: moment(dbObject[key].startDate),
          end_time: moment(dbObject[key].endDate),
          canResize: dbObject[key].addedBy === this.props.userId ? 'both' : false,
          canChangeGroup: false
        })
      )
      const categoryArr = []
      namesData = branchIds
        .map((key) => {
          if (!categoryArr.includes(dbObject[key].category.text)) {
            categoryArr.push(dbObject[key].category.text)
            return ({
              id: dbObject[key].category.text,
              title: dbObject[key].category.text
            })
          }
        })
        .filter((key) => key !== undefined)
    }
    return {bodyData, namesData}
  }
  render() {
    return (
      <div>
        <AdventureUsTimeline
          groups={this.state.groups}
          items={this.state.items}
          tripRef={this.props.tripRef}
          whichTab={this.props.whichTab}
          />
      </div>
    )
  }
}
