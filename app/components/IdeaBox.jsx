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

  componentDidMount() {
    console.log('COMPONENT DID MOUNT PROPS', this.props)
    this.listenTo(this.props.ideasRef)
  }

  componentWillReceiveProps(incoming, outgoing) {
    console.log('COMPONENT WILL RECEIVE PROPS', this.props)

    this.listenTo(incoming.ideasRef)
  }

  listenTo(ref) {
    if (this.unsubscribe) this.unsubscribe()
    const listener = ref.on('value', snapshot => {
      this.setState({ideas: snapshot.val()})
    })
    this.unsubscribe = () => ref.off('value', listener)
  }

  render() {
    console.log('IN IDEA BOX ', this.state.ideas, 'OBJECT KEYS', Object.keys(this.state.ideas))

    return (
       <div className="well well-lg">
        <div>
        <ul >
        {
        Object.keys(this.state.ideas).map(key => {
          return (
            <li key={key} className='trip-buddies'>
              <div className='buddiesListItem'>Name: {this.state.ideas[key].ideaName}</div>
              <div className='buddiesListItem'>Link: {this.state.ideas[key].link}</div>
              <div className='buddiesListItem' >Category: {this.state.ideas[key].category.text}</div>
            </li>
          )
        })
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
