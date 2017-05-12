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

// BUGS IN HERE:  DID MOUNT AND SO ALSO LISTEN FOR SLIDERS DO NOT TRIGGER AGAIN ONCE USERID IS IN PROPS, SO CANRESIZE IS NEVER BECOMING TURE;  SIMILARLY SUSPECT THAT CHANGES IN BUDDIES WON"T RERENDER IN THE TIMELINE.

export default class TimelineIndex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      groups: [],
      items: []
    }
    this.listenFor = this.listenFor.bind(this)
  }
  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }
  componentDidMount() {
    // console.log('ENTERED COMPONENENT-DID-MOUNT PROPS', this.props)
    this.props.whichTab && this.props.whichTab === 'Buddies' ?
      this.listenFor('buddies') // For Buddies Slider Timelne View
      :
      this.listenFor('ideas') // For Ideas Box Timeline View
  }
  /* For mysteriosu reasons,  DidMount works but WillReceiveProps below did not .... Learning lesson?? */
// componentWilReceiveProps(incoming, outgoing) {
//   console.log('ENTERED COMPONENENT-WILL-RECEIVE-PROPS')
//   this.listenForSliders(incoming.tripRef, incoming.userId)
// }
  listenFor(branch) {
    if (this.unsubscribe) this.unsubscribe()
    // Getting data from branch part of db
    let bodyData = [], namesData = []
    console.log('TIMELINE_INDEX, LISTEN_FOR', branch)
    const listener = this.props.tripRef.on('value', snapshot => {
      const dbObject = snapshot.val()[branch]
      const branchIds = Object.keys(dbObject)
      // now map over the db Ids and grab info as necessary depending
      // on the branch typs.
      if (branch === 'buddies') { // Make Buddies Timeline Data
        bodyData = branchIds.map(key => {
          // console.log('TIMELINE_INDEX, LISTENER USERID: ', userId)
          return {
            id: key,
            group: key,
            title: dbObject[key].status.text,
            start_time: moment(dbObject[key].startDate),
            end_time: moment(dbObject[key].endDate),
            canResize: key === this.props.userId ? 'both' : false,
            canChangeGroup: false // if we oneday get to items do conditional checks for item categories here
          }
        })
        namesData = Object.keys(dbObject).map((key) =>
         ({
           id: key,
           title: dbObject[key].name
         })
          )
      } else { //  Make Ideas Timeline Data
        bodyData = branchIds.map(key => {
          console.log('TIMELINE_INDEX, MAKE LISTENER IDEAS: ', dbObject)
          return {
            id: key,
            group: dbObject[key].category.id,
            title: dbObject[key].ideaName,
            start_time: moment(dbObject[key].startDate),
            end_time: moment(dbObject[key].endDate),
            canResize: dbObject[key].addedBy === this.props.userId ? 'both' : false,
            canChangeGroup: false // if we oneday get to items do conditional checks for item categories here
          }
        })
        namesData = Object.keys(dbObject).map((key) =>
         ({
           id: key,
           title: dbObject[key].category.text
         })
          )
      }

      // console.log('TIMELINE_INDEX LISTEN-FOR-SLIDERS, names, body', namesData, bodyData)
      this.setState({groups: namesData})
      this.setState({items: bodyData})
    })
    this.unsubscribe = () => this.props.tripRef.off('value', listener)
  }

  render() {
    // console.log('TIMELINE-INDEX, PROPS', this.props)
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
