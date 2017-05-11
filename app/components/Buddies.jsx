import React from 'react'
import firebase from 'APP/fire'
import InlineBuddyEditIndex from './InlineBuddyEditIndex'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      buddies:{}
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
      var buddies = {}
      // for (var buddy in snapshot.val()) { buddies.push({[buddy]: snapshot.val()[buddy]}) }
      // changed to an object
      this.setState({buddies: snapshot.val()})
    })
    this.unsubscribe = () => ref.off('value', listener)
    return listener
  }

  render() {
    console.log('In BUDDIES RENDER STATE OBJECT.KEYS OF SNAPSHOT VAL: ', Object.keys(this.state.buddies) || 'no buddies yet')
    console.log('In BUDDIES RENDER STATE OF SNAPSHOT VAL: ', this.state.buddies || 'no buddies yet')
    return (
      <div className="well well-lg">
        <div>
        <ul >
        { Object.keys(this.state.buddies).map((key) => {
          return (key === this.props.userId) ?
          <li key={key} className='trip-buddies'>
            <InlineBuddyEditIndex
              userId={this.props.userId}
              tripRef={this.props.tripRef}
              tripId={this.props.tripId}
            />
          </li> : <li className='trip-buddies'>
            <div className='buddiesListItem'>Name: {this.state.buddies[key].name}</div>
            <div className='buddiesListItem'>Home Base: {this.state.buddies[key].homeBase}</div>
            <div className='buddiesListItem' >Status: {this.state.buddies[key].status.text}</div>
            <div className='buddiesListItem'>Free from: {this.state.buddies[key].startDate.slice(0, 10)}</div>
            <div className='buddiesListItem'>Free until: {this.state.buddies[key].endDate.slice(0, 10)}</div>
          </li>
        }
          )}
        </ul>
        </div>
      </div>
    )
  }
}

// { Object.keys(this.state.buddies).forEach((key) => {
//           key === this.props.userId ?
//             <li>
//               <InlineBuddyEditIndex
//                   userId={this.props.userId}
//                   tripRef={this.props.tripRef}
//                   tripId={this.props.tripId}
//                 />
//             </li> : <li>BUDDY</li>
//         })
//         }
// console.log('************THIS IS THE KEY*******: ', key)
//           console.log('************THIS IS THE USERID*******: ', this.props.userId, this.props.tripRef, this.props.tripId)
//           console.log('************THIS IS THE this.state.buddies[key]*******: ', this.state.buddies[key])
