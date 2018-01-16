import {
  CLASSMATE_REQUEST, REQUEST_CLASS_COLLECTION_FAILED,
  RECEIVE_CLASS_COLLECTION, ADD_TO_CLASS_COLLECTION,
    } from '../constants';
import { REHYDRATE } from 'redux-persist/constants';

const initialState={
  isFetching: false,
  errors: [],
  classCollection: [],
}

function classmateReducer(state = initialState, action){
  let newState = Object.assign({}, state);
  const { type, payload, error } = action;

  switch(type) {
    case CLASSMATE_REQUEST: {
      newState.isFetching = true;
      break;
    }
    case RECEIVE_CLASS_COLLECTION: {
      let actualPayload = payload;
      if (payload === null) {
        actualPayload = [];
      }
      newState.classCollection = actualPayload;
      newState.errors = [];
      newState.isFetching = false;
      break;
    }
    case REHYDRATE: {
      const savedData =  action.payload ? action.payload.collectionReducer : initialState;
      newState = {...savedData};
      //Prevent isFetching rehydrate
      newState.isFetching = false;
      break;
    }
  }
  return newState;
}

export default classmateReducer;
