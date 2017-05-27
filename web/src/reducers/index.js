import {combineReducers} from 'redux';
import headerReducer from './headerReducer';
import createEventFormReducer from './createEventFormReducer';
import googleMapReducer from './googleMapReducer';

const allReducers = combineReducers({
  header: headerReducer,
  createEventForm: createEventFormReducer,
  googleMap: googleMapReducer,
});

export default allReducers;
