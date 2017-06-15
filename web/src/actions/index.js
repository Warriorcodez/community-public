export const changeHeader = (text) => {
  return {
    type: 'CHANGE_HEADER',
    payload: text
  };
};

export const toggleCreateEvent = () => {
  return {
    type: 'TOGGLE_CREATE_EVENT',
  };
};

export const addEvents = (prop) => {
  return {
    type: 'ADD_EVENTS',
    payload: prop
  };
};

export const updateForm = (state) => {
  return {
    type: 'UPDATE_FORM',
    payload: state,
  };
};

export const changeCenter = (prop) => {
  return {
    type: 'CHANGE_CENTER',
    payload: prop
  };
};

export const addGeolocation = (prop) => {
  return {
    type: 'ADD_GEOLOCATION',
    payload: prop
  };
};

export const toggleEventDetails = () => {
  return {
    type: 'TOGGLE_EVENT_DETAILS',
  };
};

export const setCurrentEvent = (data) => {
  return {
    type: 'SET_CURRENT_EVENT',
    payload: data
  };
};

export const setCurrentEventParticipants = (data) => {
  return {
    type: 'SET_CURRENT_EVENT_PARTICIPANTS',
    payload: data
  };
};

export const updateButton = (data) => {
  return {
    type: 'UPDATE_BUTTON',
    payload: data
  };
};

export const setCurrentEventLikes = (count) => {
  return {
    type: 'SET_CURRENT_EVENT_LIKES',
    payload: count
  };
};

export const incrementLikes = () => {
  return {
    type: 'INCREMENT_LIKES',
  };
};

export const decrementLikes = () => {
  return {
    type: 'DECREMENT_LIKES',
  };
};

export const toggleLoadingIndicator = () => {
  return {
    type: 'TOGGLE_LOADING_INDICATOR'
  };
};

// export const hideLoadingIndicator = () => {
//   return {
//     type: 'HIDE_LOADING_INDICATOR'
//   };
// };
