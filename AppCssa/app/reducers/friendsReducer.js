import {
  RECEIVE_FRIENDSLIST,
  REQUEST_FRIENDSLIST,
  REQUEST_FRIENDSLIST_FAILED,
} from '../constants';
import { REHYDRATE } from 'redux-persist/constants';

const initialState = {
  isFetching: false,
  errors: [],
  friendsList: [],
}

function friendsReducer(state = initialState, action) {
  let newState = Object.assign({}, state);
  const { type, payload, error } = action;

  switch (type) {
    case REQUEST_FRIENDSLIST: {
      newState.isFetching = true;
      break;
    }
    case RECEIVE_FRIENDSLIST: {
      console.log("Friend List is now ", payload);
      newState.isFetching = false;
      newState.friendsList = payload;
      break;
    }
    case REQUEST_FRIENDSLIST_FAILED: {
      newState.isFetching = false;
      newState.errors.push(error);
      break;
    }
    case REHYDRATE: {
      const savedData =  action.payload ? action.payload.friendReducer : initialState;
      newState = {...savedData};
      //Prevent changeDetected rehydrate
      newState.isFetching = false;
      newState.errors = [];
      break;
    }
  }
  return newState;
};

export default friendsReducer;
