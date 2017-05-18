import React, { Component } from 'react'
import firebase from 'APP/fire'
import AddIdea from './AddIdea'
import moment from 'moment'

// props will be ideas ref and user id

export default class IdeaBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ideas: {}
    }
    this.deleteIdea = this.deleteIdea.bind(this)
    this.addLikes = this.addLikes.bind(this)
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  componentDidMount() {
    // console.log('COMPONENT DID MOUNT PROPS', this.props)
    this.listenTo(this.props.ideasRef)
  }

  componentWillReceiveProps(incoming, outgoing) {
    // console.log('COMPONENT WILL RECEIVE PROPS', this.props)
    this.listenTo(incoming.ideasRef)
  }

  listenTo(ref) {
    if (this.unsubscribe) this.unsubscribe()
    const listener = ref.on('value', snapshot => {
      this.setState({ ideas: snapshot.val() })
    })
    this.unsubscribe = () => ref.off('value', listener)
  }

  deleteIdea(e) {
    // console.log('IN IDEA DELETE BTTN', 'ID', e.target.id)
    this.props.ideasRef.child(e.target.id).remove()
  }

  addLikes(e) {
    this.props.ideasRef.child(e.target.id).child('likes')
      .transaction(likes => ++likes
      )
  }
  handleClick(e, idea) {
    // will eventuall
    console.log(e.target, idea)
  }

  render() {
    // console.log('IN IDEA BOX ', this.state.ideas)
    // own comments: have three buttons: 2 for choosing what view (table form or pin-board form) and another for adding a new idea.
    // console.log('IN IDEA BOX ', Object.values(this.state.ideas))
    return (
      <div>
       <div>
         <div>
           <AddIdea
              userId={this.props.userId}
              ideasRef={this.props.ideasRef}
            />
         </div>
          <div className='allIdeas'>
          {
            this.state.ideas && Object.keys(this.state.ideas).map(key => {
              return (
                <div key={key} className='idea-container'>
                  <div className='idea front'>
                    <div className='name'>{this.state.ideas[key].ideaName}
                      <div className='link'><a href={this.state.ideas[key].link}
                        target='_blank' className='link word-wrap'>{this.state.ideas[key].link}</a></div>
                      <div className='category'>{this.state.ideas[key].category.text}</div>
                      <div className='startdate'>{moment(this.state.ideas[key].startDate).calendar()}</div>
                      <div className='likes'>
                        <button style={{color: '#18bc9c', backgroundColor: '#ffffff', borderRadius: '5px', padding: '1px 6px'}}className='trip-buddies-likes-button'
                            type="button" id={key} onClick={ this.addLikes}>{this.state.ideas[key].likes}</button>
                      </div>
                      <div className='delete'>
                        <button style={{color: '#18bc9c', backgroundColor: '#ffffff', borderRadius: '5px', padding: '1px 6px'}}className='trip-buddies-delete-button'
                            type="button" id={key} onClick={this.deleteIdea}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          }
          </div>
        </div>
      </div>
    )
  }
}
