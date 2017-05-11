import React, { Component } from 'react'
import firebase from 'APP/fire'
import AddIdea from './AddIdea'

// props will be ideas ref and user id

export default class IdeaBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ideas: {}
    }
  }

  componentWillReceiveProps(incoming, outgoing) {
    // When the props sent to us by our parent component change,
    // start listening to the new firebase reference.
    // console.log('FROM RECEIVE PROPS', incoming)
    this.listenTo(incoming.ideasRef)
    // this.listenTo(incoming.tripsRef.child(tripId))
  }

  listenTo(ref) {
    console.log('in listenTo in IdeaBpox ref.key', ref.key)
    if (this.unsubscribe) this.unsubscribe()
    const listener = ref.on('value', snapshot => {
      this.setState({ideas: snapshot.val()})
    })
    this.unsubscribe = () => ref.off('value', listener)
  }

  render() {
    console.log('in Idea Box props', this.props)
    return (
       <div className="well well-lg">
        <div>
        <ul >
        { Object.keys(this.state.ideas).map((key) =>
          <li key={key} className='trip-buddies'>
            <div className='buddiesListItem'>Name: {this.state.idea.ideaName}</div>
            <div className='buddiesListItem'>Link: {this.state.idea.link}</div>
            <div className='buddiesListItem' >Status: {this.state.idea.category}</div>
          </li>
        )
        }
          <li className='trip-buddies'>
              <AddIdea
                userId={this.props.userId}
                ideasRef={this.props.ideasRef}
              />
          </li>
        </ul>
        </div>
      </div>
    )
  }
}
