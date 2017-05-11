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
// Note: title in an sliderData group will be the name of a buddy or self

export default class TimelineIndex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      groups: [],
      items: []
    }
    this.listenForSliders = this.listenForSliders.bind(this)
  }
  componentWillUnmount() {
    // When we unmount, stop listening.
    this.unsubscribe()
  }
  componentDidMount() {
    console.log('ENTERED COMPONENENT-DID-MOUNT')
    this.listenForSliders(this.props.tripRef, this.props.userId)
  }
  // For mysteriosu reasons,  DidMount works but WillReceiveProps below did not .... Learning lesson??
  // componentWilReceiveProps(incoming, outgoing) {
  //   console.log('ENTERED COMPONENENT-WILL-RECEIVE-PROPS')
  //   this.listenForSliders(incoming.tripRef, incoming.userId)
  // }
  listenForSliders(tripRef, userId) {
    if (this.unsubscribe) this.unsubscribe()
    // LOGIC HERE BEACUSE FOR NOW WE ONLY RENDER A SLIDER TIMELINE:
    // Getting data from trip part of db
    let sliderData = [], namesData = []
    console.log('ENTERED LISTEN-FOR-SLIDERS', namesData, sliderData)
    const listener = tripRef.on('value', snapshot => {
      const buddiesObject = snapshot.val().buddies
      const buddiesIds = Object.keys(buddiesObject) // do not need this line of code
      // now map over the buddies Ids and grab the start and end dates
      sliderData = Object.keys(buddiesObject).map((key, _id, _arr, userId) => {
        return {
          id: key,
          group: key,
          title: buddiesObject[key].name,
          start_time: moment(buddiesObject[key].availabilityStart),
          end_time: moment(buddiesObject[key].availabilityEnd),
          canResize: key === userId ? 'both' : false,
          canChangeGroup: false // if we oneday get to items do conditional checks for item categories here
        }
      })
      console.log('LISTEN-FOR-SLIDERS, names, slider', namesData, sliderData)
      namesData = Object.keys(buddiesObject).map((key) =>
         ({
           id: key,
           title: buddiesObject[key].name
         })
      )
      console.log('LISTEN-FOR-SLIDERS, names, slider', namesData, sliderData)
      this.setState({groups: namesData})
      this.setState({items: sliderData})
    })
    this.unsubscribe = () => tripRef.off('value', listener)
  }

  render() {
    console.log('TIMELINE-INDEX, PROPS', this.props)
    return (
      <div>
        <AdventureUsTimeline
          groups={this.state.groups}
          items={this.state.items}
          tripRef={this.props.tripRef}
          />
      </div>
    )
  }
}
