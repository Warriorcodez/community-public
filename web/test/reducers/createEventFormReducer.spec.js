import createEventFormReducer from '../../src/reducers/createEventFormReducer';

describe('Create Event Form Reducer', () => {

  it('has a default state', () => {
    expect(createEventFormReducer(undefined, { type: 'unexpected' })).toEqual({
      eventName: '',
      time: '',
      location: '',
      description: '',
      category: 'Category',
    });
  });

});
