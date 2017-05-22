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
    this.listenTo(this.props.ideasRef)
  }

  componentWillReceiveProps(incoming, outgoing) {
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
    this.props.ideasRef.child(e.target.id).remove()
  }

  addLikes(e) {
    this.props.ideasRef.child(e.target.id).child('likes')
      .transaction(likes => ++likes
      )
  }

  render() {
    // own comments: have three buttons:
    // 2 for choosing what view (table form or pin-board form)
    // and another for adding a new idea.
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
                  <div className='idea front handwriting-font'>
                    <div className='name'>
                      <div className='name'><h4
                           className='handwriting-font'>{this.state.ideas[key].ideaName}</h4></div>
                      <div className='link'>
                        <a href={this.state.ideas[key].link}
                           target='_blank'
                           className='link word-wrap'>{this.state.ideas[key].link}</a>
                      </div>
                      <div className='category'>{this.state.ideas[key].category.text}</div>
                      <div className='startdate'>From: {moment(this.state.ideas[key].startDate).calendar()} To: {moment(this.state.ideas[key].endDate).calendar()}</div>
                    </div>
                     <hr className='horizontal-rule'/>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <div className='likes'>
                        <span style={{borderRadius: '5px', padding: '1px 6px', borderColor: 'black'}}
                              className='trip-buddies-likes-button'
                              type="button"
                              id={key}
                              onClick={this.addLikes}>Likes {this.state.ideas[key].likes}</span>
                      </div>
                      <div className='delete'>
                        <span style={{borderRadius: '5px', padding: '1px 6px', borderColor: 'black'}}
                              className='trip-buddies-delete-button'
                              type="button"
                              id={key}
                              onClick={this.deleteIdea}>Delete</span>
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
