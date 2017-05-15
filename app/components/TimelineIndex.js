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
    this.listenFor = this.listenFor.bind(this)
  }
  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }
  componentDidMount() {
    this.props.whichTab && this.props.whichTab === 'Buddies' ?
      this.listenFor('buddies') // For Buddies Slider Timelne View
      :
      this.listenFor('ideas') // For Ideas Box Timeline View
  }

  /* For mysteriosu reasons,  DidMount works but WillReceiveProps below did not .... Learning lesson?? */
  // It's not getting in oldProps too
  componentWillReceiveProps(nextProps) {
    nextProps.whichTab && nextProps.whichTab === 'Buddies' ?
      this.listenFor('buddies') // For Buddies Slider Timelne View
      :
      this.listenFor('ideas') // For Ideas Box Timeline View
  }
  buddiesData = (snapshot) => {
    const dbObject = snapshot.val()['buddies']
    let branchIds = [], bodyData = [], namesData = []
    if (dbObject) {
      branchIds = Object.keys(dbObject)
      bodyData = branchIds.map(key => {
        return {
          id: key,
          group: key,
          title: dbObject[key].status.text,
          start_time: moment(dbObject[key].startDate),
          end_time: moment(dbObject[key].endDate),
          canResize: key === this.props.userId ? 'both' : false,
          canChangeGroup: false
        }
      })
      namesData = Object.keys(dbObject).map((key) => ({id: key, title: dbObject[key].name}))
    }
    return {bodyData, namesData}
  }

  ideasData = (snapshot) => {
    const dbObject = snapshot.val()['ideas']
    let branchIds = [], bodyData = [], namesData = []
    if (dbObject) {
      branchIds = Object.keys(dbObject)
      // now map over the db Ids and grab info as necessary depending
      // on the branch typs.
      bodyData = branchIds.map(key => {
        return {
          id: key,
          group: dbObject[key].category.text,
          title: dbObject[key].ideaName,
          start_time: moment(dbObject[key].startDate),
          end_time: moment(dbObject[key].endDate),
          canResize: dbObject[key].addedBy === this.props.userId ? 'both' : false,
          canChangeGroup: false // if we oneday get to items do conditional checks for item categories here
        }
      })
      const categoryArr = []
      namesData = Object.keys(dbObject).map((key) => {
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

  listenFor(branch) {
    if (this.unsubscribe) this.unsubscribe()
    // Getting data from branch part of db

    let bodyData = [], namesData = []
    const listener = this.props.tripRef.on('value', snapshot => {
      const dbObject = snapshot.val()[branch]
      var branchIds = []
      if (dbObject) {
        branchIds = Object.keys(dbObject)
      }
      // now map over the db Ids and grab info as necessary depending
      // on the branch typs.
      if (branch === 'buddies') { // Make Buddies Timeline Data
        bodyData = branchIds.map(key => {
          //
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
        if (dbObject) {
          namesData = Object.keys(dbObject).map((key) =>
            ({
              id: key,
              title: dbObject[key].name
            }))
        }
      } else { //  Make Ideas Timeline Data
        bodyData = branchIds.map(key => {
          return {
            id: key,
            group: dbObject[key].category.text,
            title: dbObject[key].ideaName,
            start_time: moment(dbObject[key].startDate),
            end_time: moment(dbObject[key].endDate),
            canResize: dbObject[key].addedBy === this.props.userId ? 'both' : false,
            canChangeGroup: false // if we oneday get to items do conditional checks for item categories here
          }
        })
        // use this categoryArr to hold the categories,
        // if it does not contain the category on the dbObject,
        //    then add the object to the namesData array in the map
        // otherwise it is a duplicte, so do not add that dbObject item in the map
        const categoryArr = []
        if (dbObject) {
          namesData = Object.keys(dbObject).map((key) => {
            if (!categoryArr.includes(dbObject[key].category.text)) {
              categoryArr.push(dbObject[key].category.text)
              return ({
                // id: key,
                id: dbObject[key].category.text,
                title: dbObject[key].category.text
              })
            }
          })
            .filter((key) => key !== undefined)
        }
      }
//       this.setState({groups: namesData})
//       this.setState({items: bodyData})
//     })
//     this.unsubscribe = () => this.props.tripRef.off('value', listener)
    // HACK: the following setTimeout is a hack to force initial rendering of the timeline data. The data is there and shows as soon as we do anything to the view
    setTimeout(() => {
      const listener = this.props.tripRef.on('value', snapshot => {
        const data = (branch === 'buddies' ? this.buddiesData(snapshot) : this.ideasData(snapshot))
        this.setState({
          groups: data['namesData'],
          items: data['bodyData']
        })
      })
      this.unsubscribe = () => this.props.tripRef.off('value', listener)
    }, 10)
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
