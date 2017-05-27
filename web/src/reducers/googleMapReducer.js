const initialState = { lat: 37.774929, lng: -122.419416 };

export default function(state = initialState, action) {
  switch (action.type) {
  case 'CHANGE_CENTER' :
    return action.payload;
  default:
    return state;
  }
}
