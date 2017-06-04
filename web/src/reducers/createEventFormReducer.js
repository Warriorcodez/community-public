import axios from 'axios';

const initialState = {
  eventName: '',
  time: '',
  location: '',
  description: '',
  category: 'Category',
};

export default function(state = initialState, action) {
  switch (action.type) {

  case 'UPDATE_FORM':
    return action.payload;

  default:
    return state;
  }
}
