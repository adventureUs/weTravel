import React from 'react'
import Buddies from './Buddies'
import IdeaBox from './IdeaBox'
import firebase from 'APP/fire'

export default class TabsAndView extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const auth = firebase.auth()
    this.unsubscribe = auth && auth.onAuthStateChanged(user => this.setState({user}))
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }
  componentWilReceiveProps(incomming, outgoing) {
    console.log('******TABS AND VIEWS WILL RECEIVE PROPS***INCOMMING: ', incomming)
  }

  render() {
    console.log('TABS AND VIEWS STATE', this.props)
    return (
    <div>
      <ul
          className="nav nav-tabs">
        <li className={this.props.whichTab ? 'active' : ''}>
          <a id='Buddies' href="#buddies" onClick={this.props.changeTabs}
              >Buddies</a>
        </li>
        <li className={this.props.whichTab ? '' : 'active'}>
          <a id='Idea Box' href="#ideabox" onClick={this.props.changeTabs}
              >Idea Box</a>
        </li>
      </ul>

      <div id="myTabContent"
            className="tab-content">
        {
        this.props.whichTab === 'Buddies' ?
          <div className="tab-pane fade active in"
                id="buddies">
            <Buddies
              userId={this.props.userId}
              tripRef={this.props.tripRef}
              tripId={this.props.tripId}
              />
          </div>
        :
          <div className="tab-pane fade active in"
                id="ideaBox">
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

// render() {
//   return (
//   <div>
//     <ul onClick={() => this.setState({whichTab: !this.state.changeTabs})}
//         className="nav nav-tabs">
//       <li className="active">
//         <a href="#buddies"
//             data-toggle="tab">Buddies</a>
//       </li>
//       <li>
//         <a href="#ideaBox"
//             data-toggle="tab">IdeaBox</a>
//       </li>
//     </ul>

//     <div id="myTabContent"
//           className="tab-content">

//       <div className="tab-pane fade active in"
//             id="buddies">
//         <InlineBuddyEditIndex />
//       </div>

//       <div className="tab-pane fade"
//             id="ideaBox">
//         <IdeaBox />
//       </div>

//     </div>
//   </div>
//   )
// }
