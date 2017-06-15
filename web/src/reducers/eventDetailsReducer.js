const initialState = {
  showEventDetails: false,
  currentEvent: {},
  participants: [],
  isAttendingEvent: false,
  hasLikedEvent: false,
  likeCount: 0
};

export default function(state = initialState, action) {
  switch (action.type) {

  case 'TOGGLE_EVENT_DETAILS':
    return Object.assign({}, state, { showEventDetails: !state.showEventDetails });

  case 'SET_CURRENT_EVENT':
    return Object.assign({}, state, { currentEvent: action.payload });

  case 'SET_CURRENT_EVENT_PARTICIPANTS':
    return Object.assign({}, state, { participants: action.payload });

  case 'UPDATE_BUTTON':
    return Object.assign({}, state, action.payload);

  case 'SET_CURRENT_EVENT_LIKES':
    return Object.assign({}, state, { likeCount: action.payload });

  case 'INCREMENT_LIKES':
    return Object.assign({}, state, { likeCount: state.likeCount + 1 });

  case 'DECREMENT_LIKES':
    return Object.assign({}, state, { likeCount: state.likeCount - 1 });

  default:
    return state;
  }
}
