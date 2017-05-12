import React from 'react'
import Buddies from './Buddies'
import IdeaBox from './IdeaBox'
import firebase from 'APP/fire'

export default class TabsAndView extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      changeTabs: true
    }
  }

  componentWillMount() {
    const auth = firebase.auth()
    this.unsubscribe = auth && auth.onAuthStateChanged(user => this.setState({user}))
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  render() {
    // console.log('TABS AND VIEWS PROPS', this.props)
    return (
    <div>
      <ul
          className="nav nav-tabs">
        <li className={this.state.changeTabs ? 'active' : ''} onClick={() => this.setState({changeTabs: true})}>
          <a href="#buddies"
              >Buddies</a>
        </li>
        <li className={this.state.changeTabs ? '' : 'active'} onClick={() => this.setState({changeTabs: false})}>
          <a href="#ideabox"
              >Idea Box</a>
        </li>
      </ul>

      <div id="myTabContent"
            className="tab-content">
        {
        this.state.changeTabs ?
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
//     <ul onClick={() => this.setState({changeTabs: !this.state.changeTabs})}
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
