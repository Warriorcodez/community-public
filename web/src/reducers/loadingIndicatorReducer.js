const initialState = {
  isLoading: false
};

export default function(state = initialState, action) {
  if (action.type === 'TOGGLE_LOADING_INDICATOR') {
    return Object.assign({}, state, {isLoading: !state.isLoading});
  }

  return state;
}
