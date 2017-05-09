import React from 'react'
import {Link} from 'react-router'
import firebase from 'APP/fire'

import TitleBar from './TitleBar'
import Timeline from './Timeline'
import Chat from './Chat'
import TabsAndViews from './TabsAndViews'

const auth = firebase.auth()
const db = firebase.database()

export default () =>
  (
    <div className="">
      <Timeline />
      <div className="row">
        <div className="col col-lg-3">
          <Chat />
        </div>

        <div className="col col-lg-9">
          <TabsAndViews />
        </div>
        </div>
    </div>
  )
