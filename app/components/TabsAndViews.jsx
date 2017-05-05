import React from 'react'
import TravelBuddies from './TravelBuddies'
export default class TabsAndView extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      changeTabs: false
    }
  }
  componentWillMount() {
    const auth = this.props.route.auth
    this.unsubscribe = auth && auth.onAuthStateChanged(user => this.setState({user}))
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }
  render() {
    return (
    <div>
      <ul onClick={() => this.setState({[this.state.changeTabs]: !this.state.changeTabs})}
          className="nav nav-tabs">
        <li className="active">
          <a href="#buddies"
              data-toggle="tab">Buddies</a>
        </li>
        <li>
          <a href="#itinerary"
              data-toggle="tab">Itinerary</a>
        </li>
      </ul>
      <div id="myTabContent"
            className="tab-content">
        <div className="tab-pane fade active in"
              id="buddies">
          <TravelBuddies />
        </div>
        <div className="tab-pane fade"
              id="itinerary">
          <p> Under Construction Items View </p>
        </div>
      </div>
    </div>
    )
  }
}
