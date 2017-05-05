import React from 'react'
import {Link} from 'react-router'
import firebase from 'APP/fire'

import TitleBar from './TitleBar'
import Timeline from './Timeline'
import Chat from './Chat'
import TabsAndViews from './TabsAndViews'

const auth = firebase.auth()

export default class extends React.Component {
  componentDidMount() {
    // const {auth} = this.props
    // this.unsubscribe = auth.onAuthStateChanged(user => this.setState({user}))
  }

  componentWillUnmount() {
    // this.unsubscribe()
  }

  render() {
    return (
      <div className="">
        <TitleBar />
        <Timeline />
        <div className="row">
          <div className="col col-lg-3">
            <Chat />
          </div>

          <div className="col col-lg-9">
            <TabsAndViews />
          </div>
          </div>
      </div>
    )
  }
}
