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
      this.setState({ideas: snapshot.val()})
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

  render() {
    // console.log('IN IDEA BOX ', this.state.ideas)
    // own comments: have three buttons: 2 for choosing what view (table form or pin-board form) and another for adding a new idea.
    return (
      <div>
       <div className="well well-sm">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Idea</th>
              <th>Link</th>
              <th>Category</th>
              <th>Start Time</th>
              <th>Likes</th>
            </tr>
          </thead>
          <tbody>
          {
            this.state.ideas && Object.keys(this.state.ideas).map(key => {
              return (
                <tr key={key} className='trip-buddies'>
                  <td >{this.state.ideas[key].ideaName}</td>
                  <td ><a href={'//'+this.state.ideas[key].link}
                    target='_blank'>{this.state.ideas[key].link}</a></td>
                  <td >{this.state.ideas[key].category.text}</td>
                  <td>{moment(this.state.ideas[key].startDate).calendar()}</td>
                  <td>
                    <button style={{
                      color: '#18bc9c',
                      backgroundColor: '#ffffff',
                      borderRadius: '5px',
                      padding: '1px 6px'
                    }}
                        type="button"
                        id={key}
                        onClick={ this.addLikes}>{this.state.ideas[key].likes}
                    </button>
                  </td>
                  <td>
                    <button style={{
                      color: '#18bc9c',
                      backgroundColor: '#ffffff',
                      borderRadius: '5px',
                      padding: '1px 6px'
                    }}
                        type="button"
                        id={key}
                        onClick={this.deleteIdea}>Delete
                    </button>
                  </td>
                </tr>
              )
            })
          }
          </tbody>
          </table>
        </div>
        <div className='trip-buddies well well-sm'>
            <AddIdea
              userId={this.props.userId}
              ideasRef={this.props.ideasRef}
            />
        </div>
      </div>
    )
  }
}
