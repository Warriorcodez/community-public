export const changeHeader = (text) => {
  return {
    type: 'CHANGE_HEADER',
    payload: text
  };
};

export const updateForm = (prop, value) => {
  return {
    type: 'UPDATE_FORM',
    payload: { prop: prop, value: value }
  };
};

export const changeCenter = (prop) => {
  return {
    type: 'CHANGE_CENTER',
    payload: prop
  };
};

export const setMarkers = (prop) => {
  return {
    type: 'SET_MARKERS',
    payload: prop
  };
};
