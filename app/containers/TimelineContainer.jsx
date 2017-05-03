import { connect } from 'react-redux'
import Timeline from '../components/Timeline'

// map State To Props takes what is already on State
// const mapStateToProps = () =>
//   return {
//     }

// Whatever function I put here, to update the state, I need to
// make sure the returned value of the state is above in
// map State To Props
// const mapDispatchToProps = { getCurrTemp }
// we dispatch the dispatcher,
// which dispatches the action creator,
// which triggers the reducer
// which changes the state

export default connect(null, null)(Timeline)
