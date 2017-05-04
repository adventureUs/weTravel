import React from 'react'
import TravelBuddies from './TravelBuddies'
import Itinerary from './Itinerary'

const TabsAndView = () =>
  (
  <div>

    <ul className="nav nav-tabs">
      <li className="active">
        <a href="#buddies"
            data-toggle="tab">Buddies</a>
      </li>
      <li>
      <a href="#itinerary"
          data-toggle="tab">Itinerary</a>
      </li>
    </ul>

    <div className="tab-content">
      <div className="tab-pane fade in active" id="buddies">
        <TravelBuddies />
      </div>
      <div className="tab-pane fade" id="itinerary">
        <Itinerary/>
      </div>
    </div>

  </div>
  )

export default TabsAndView
