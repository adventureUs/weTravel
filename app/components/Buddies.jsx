import React from 'react'
import firebase from 'APP/fire'
import InlineBuddyEditIndex from './InlineBuddyEditIndex'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      buddies:[]
    }
  }
  componentWillMount() {
    // we want to loop over the buddies in the current trip and have them render out in the list of items.
    // We need to check if the user we're looping over is the current user, if so, pass them through to InlineBuddyEditIndex
  }
  componentWillReceiveProps(incoming, outgoing) {
    // When the props sent to us by our parent component change,
    // start listening to the new firebase reference.
    // console.log('FROM RECEIVE PROPS', incoming)
    this.listenTo(incoming.tripRef.child('/buddies'))
    // this.listenTo(incoming.tripsRef.child(tripId))
  }
  listenTo(ref) {
    if (this.unsubscribe) this.unsubscribe()
    const listener = ref.on('value', snapshot => {
      var buddies = [...this.state.buddies]
      for (var buddy in snapshot.val()) { buddies.push(snapshot.val()[buddy]) }
      this.setState({buddies: buddies})
    })
    this.unsubscribe = () => ref.off('value', listener)
    return listener
  }

  render() {
    console.log('In BUDDIES RENDER STATE SHOULD BE SNAPSHOT VAL: ', this.state)
    return (
      <div className="well well-lg">
        <div >
        <ul>
        <li>
          <InlineBuddyEditIndex
              userId={this.props.userId}
              tripRef={this.props.tripRef}
              tripId={this.props.tripId}
            />
          </li>
        <p>Lorem paragraphum.</p>
        <p>Lorem paragraphum.</p>
        <p>Lorem paragraphum.</p>
        </ul>
        </div>
      </div>
    )
  }
}
