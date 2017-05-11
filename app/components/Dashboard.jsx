import React from 'react'
import {Link} from 'react-router'
import firebase from 'APP/fire'

import TitleBar from './TitleBar'
import TimelineIndex from './TimelineIndex'
import Chat from './Chat'
import TabsAndViews from './TabsAndViews'

const auth = firebase.auth()
const db = firebase.database()

export default (props) =>
  (
    <div className="">
      <TimelineIndex
        userId={props.userId}
        tripRef={props.tripRef}
        />
      <div className="row">
        <div className="col col-lg-3">
          <Chat />
        </div>

        <div className="col col-lg-9">
          <TabsAndViews
            userId={props.userId}
            tripRef={props.tripRef}
            tripId={props.tripId}
            usersRef={db.ref('users')}
            />
        </div>
        </div>
    </div>
  )
