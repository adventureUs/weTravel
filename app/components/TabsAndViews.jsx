import React from 'react'
import InlineBuddyEditIndex from './InlineBuddyEditIndex'
import Itinerary from './Itinerary'
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
    console.log('Ternary', this.state.changeTabs)
    return (
    <div>
      <ul
          className="nav nav-tabs">
        <li className={this.state.changeTabs ? 'active' : ''} onClick={() => this.setState({changeTabs: true})}>
          <a href="#buddies"
              >Buddies</a>
        </li>
        <li className={this.state.changeTabs ? '' : 'active'} onClick={() => this.setState({changeTabs: false})}>
          <a href="#itinerary"
              >Itinerary</a>
        </li>
      </ul>

      <div id="myTabContent"
            className="tab-content">
        {
        this.state.changeTabs ?
          <div className="tab-pane fade active in"
                id="buddies">
            <InlineBuddyEditIndex />
          </div>
        :
          <div className="tab-pane fade active in"
                id="itinerary">
            <Itinerary />
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
//         <a href="#itinerary"
//             data-toggle="tab">Itinerary</a>
//       </li>
//     </ul>

//     <div id="myTabContent"
//           className="tab-content">

//       <div className="tab-pane fade active in"
//             id="buddies">
//         <InlineBuddyEditIndex />
//       </div>

//       <div className="tab-pane fade"
//             id="itinerary">
//         <Itinerary />
//       </div>

//     </div>
//   </div>
//   )
// }
