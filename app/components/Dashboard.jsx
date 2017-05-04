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
      <div className='jumbotron'>
        <TitleBar />
        <Timeline />
        <Chat />
        <TabsAndViews />
      </div>
    )
  }
}
