import React, { Component } from 'react'
import {Link} from 'react-router'
import firebase from 'APP/fire'

import TitleBar from './TitleBar'
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
    return (
      <div>
        <div className="row">
          <div className="col col-md-3">
            <Chat
            userId={this.props.userId}
            tripRef={this.props.tripRef}/>
          </div>
          <div className="col col-md-9 background-white">
            <div className='tabsAndViews'>
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
      </div>
    )
  }
}
