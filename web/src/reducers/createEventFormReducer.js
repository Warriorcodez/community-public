import axios from 'axios';

const initialState = {
  eventName: '',
  time: '',
  location: '',
  description: '',
  category: 'Category',
  // isFetching: false,
};

export default function(state = initialState, action) {
  switch (action.type) {

  case 'UPDATE_FORM':
    // .then((res) => {
    //   console.log(res.data);
    // })
    // .catch((err) => { console.log('error when creating event', err); });
    // // return Object.assign({}, action.payload, {isFetching: true});
    return action.payload;

  default:
    return state;
  }
}
