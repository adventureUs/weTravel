import React from 'react'
import ReactTooltip from 'react-tooltip'
import Buddies from './Buddies'
import IdeaBox from './IdeaBox'
import TimelineIndex from './TimelineIndex'
import firebase from 'APP/fire'

export default class TabsAndView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      changeTabs: true
    }
  }
  componentDidMount(props) {
//     console.log('*IN TABS AND VIEWS COMPONENT DID MOUNT*****, props', this.props)
  }
  componentWillMount() {
    const auth = firebase.auth()
    this.unsubscribe = auth && auth.onAuthStateChanged(user => this.setState({ user }))
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }
  componentWilReceiveProps(incomming, outgoing) {
//     console.log('******TABS AND VIEWS WILL RECEIVE PROPS***INCOMMING: ', incomming)
  }

  render() {
    // console.log('TABS AND VIEWS STATE', this.props)
    return (
      <div className='ideas-main-container'>
        <ul
          className="nav nav-tabs">
        <li className={this.props.whichTab ? 'active' : ''}>
          <a id='Buddies'
              href="#buddies"
              onClick={this.props.changeTabs}
              data-tip="Click here to see all of your buddies invited to the trip."
              >Buddies</a>
              <ReactTooltip />
        </li>
        <li className={this.props.whichTab ? '' : 'active'}>
          <a id='Idea Box'
          className='IdeaBoxTab'
              href="#ideabox"
              onClick={this.props.changeTabs}
              data-tip="Click here to view and add ideas for your trip."
              >Idea Box</a>
              <ReactTooltip />
        </li>
      </ul>

      <div id="myTabContent"
            className="tab-content">
        {
        this.props.whichTab === 'Buddies' ?
          <div className="tab-pane fade active in"
                id="buddies">
            <TimelineIndex
              userId={this.props.userId}
              tripRef={this.props.tripRef}
              whichTab='Buddies'
            />
            <Buddies
              userId={this.props.userId}
              tripRef={this.props.tripRef}
              tripId={this.props.tripId}
            />
              </div>
          :
          <div className="tab-pane fade active in"
            id="ideaBox">
            <TimelineIndex
              userId={this.props.userId}
              tripRef={this.props.tripRef}
              whichTab='ideaBox'
            />
            <IdeaBox
              userId={this.props.userId}
              ideasRef={this.props.tripRef.child('ideas')}
            />
          </div>
          }

        </div>
      </div>
    )
  }
}
