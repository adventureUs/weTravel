import React, { Component } from 'react'
import {Link} from 'react-router'
import firebase from 'APP/fire'

import TitleBar from './TitleBar'
import TimelineIndex from './TimelineIndex'
import Chat from './Chat'
import TabsAndViews from './TabsAndViews'

const auth = firebase.auth()
const db = firebase.database()

export default class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      whichTab: 'Buddies'
    }
    this.changeTabs = this.changeTabs.bind(this)
  }
  changeTabs(e) {
    e.preventDefault()
    if ((e.target.id === 'Buddies') || (e.target.id === 'Idea Box')) {
      this.setState({whichTab: e.target.id})
    }
  }
  render() {
    console.log('***************DASHBOARD**********WHICH TAB?***********: ', this.state.whichTab)
    return (
      <div className="">
        <TimelineIndex
          userId={this.props.userId}
          tripRef={this.props.tripRef}
          whichTab={this.state.whichTab}
          changeTabs={this.changeTabs}
          />
        <div className="row">
          <div className="col col-lg-3">
            <Chat />
          </div>

          <div className="col col-lg-9">
            <TabsAndViews
              userId={this.props.userId}
              tripRef={this.props.tripRef}
              tripId={this.props.tripId}
              usersRef={db.ref('users')}
              whichTab={this.state.whichTab}
              changeTabs={this.changeTabs}
              />
          </div>
          </div>
      </div>
    )
  }
}
