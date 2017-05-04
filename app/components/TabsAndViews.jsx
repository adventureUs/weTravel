import React from 'react'
import TravelBuddies from './TravelBuddies'

const TabsAndView = () =>
  (
  <div>
    <ul class="nav nav-tabs">
      <li class="active"><a href="#buddies" data-toggle="tab">Buddies</a></li>
      <li><a href="#itinerary" data-toggle="tab">Itinerary</a></li>
    </ul>
    <div id="myTabContent" class="tab-content">
      <div class="tab-pane fade active in" id="buddies">
        <TravelBuddies />
      </div>
      <div class="tab-pane fade" id="itinerary">
        <p> Under Construction Items View </p>
      </div>
    </div>
  </div>
  )

export default TabsAndView
