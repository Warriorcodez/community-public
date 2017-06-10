const initialState = {
  showEventDetails: false,
  currentEvent: {},
  participants: [],
  attendDisabled: false,
  likeDisabled: false
};

export default function(state = initialState, action) {
  switch (action.type) {

  case 'TOGGLE_EVENT_DETAILS':
    return Object.assign({}, state, { showEventDetails: !state.showEventDetails });

  case 'SET_CURRENT_EVENT':
    return Object.assign({}, state, { currentEvent: action.payload });

  case 'SET_CURRENT_EVENT_PARTICIPANTS':
    return Object.assign({}, state, { participants: action.payload });

  case 'DISABLE_BUTTON':
    return Object.assign({}, state, action.payload);

  default:
    return state;
  }
}
