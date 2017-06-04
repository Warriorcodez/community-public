import { combineReducers } from 'redux';
import createEventFormReducer from './createEventFormReducer';
import eventsReducer from './eventsReducer';
import googleMapReducer from './googleMapReducer';
import headerReducer from './headerReducer';

const allReducers = combineReducers({
  header: headerReducer,
  createEventForm: createEventFormReducer,
  googleMap: googleMapReducer,
  events: eventsReducer
});

export default allReducers;
