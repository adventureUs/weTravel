import React from 'react'
import {Link} from 'react-router'
import firebase from 'APP/fire'

import TitleBar from './TitleBar'
import TimelineIndex from './TimelineIndex'
import Chat from './Chat'
import TabsAndViews from './TabsAndViews'

const auth = firebase.auth()
const db = firebase.database()

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      uid: '',
      tripId: '',
      trips: [],
      buddies: []
    }
  }
// for MVP we just dup the user into the first saved trip for them.
  componentDidMount() {
    this.props.auth.onAuthStateChanged(user => {
      this.props.userRef.child('/' + user.uid + '/trips')
        .on('value', snapshot => {
          this.setState({
            tripId: snapshot.val()[0],
            trips: snapshot.val(),
            uid: user.uid
          })
        })
    })
    this.listenTo(this.props.userRef.child('/' + this.state.uid))
  }

  componentWillUnmount() {
    // When we unmount, stop listening.
    this.unsubscribe()
  }

  componentWillReceiveProps(incoming, outgoing) {
    // When the props sent to us by our parent component change,
    // start listening to the new firebase reference.
    this.listenTo(incoming.userRef)
  }

  listenTo(userRef) {
    // If we're already listening to a ref, stop listening there.
    if (this.unsubscribe) this.unsubscribe()
    // Whenever our ref's value changes, set {value} on our state.
    const listener = firebase.database()
                    .ref('users/' + this.state.uid)
                    .on('value', snapshot => {
                      this.setState(snapshot.val()[this.state.uid])
                    })
    // Set unsubscribe to be a function that detaches the listener.
    this.unsubscribe = () => userRef.off('value', listener)
  }

  render() {
    return (
      <div className="">
        <TitleBar {...this.state} />
        <TimelineIndex/>
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
