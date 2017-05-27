const initialState = {
  center: {
    lat: 37.774929,
    lng: -122.419416
  },
  markers: [],
};

export default function(state = initialState, action) {
  switch (action.type) {

  case 'CHANGE_CENTER' :
    let CenterState = Object.assign({}, state);
    CenterState.center = action.payload;
    return CenterState;

  case 'SET_MARKERS' :
    let MarkerState = Object.assign({}, state);
    MarkerState.markers = action.payload;
    return MarkerState;

  default:
    return state;
  }
}
