const initialState = {
  eventName: '',
  time: '',
  location: '',
  description: '',
  category: 'Category',
  creatingEvent: false
};

export default function(state = initialState, action) {
  switch (action.type) {

  case 'UPDATE_FORM':
    return action.payload;

  case 'TOGGLE_CREATE_EVENT':
    return Object.assign({}, state, { creatingEvent: !state.creatingEvent });

  default:
    return state;
  }
}
