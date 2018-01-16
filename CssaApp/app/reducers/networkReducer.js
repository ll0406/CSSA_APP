import {
  CHANGE_CONNECTION_STATUS
    } from '../constants';
import { REHYDRATE } from 'redux-persist/constants';

const initialState = {
  isConnected: false
}

function networkReducer(state = initialState, action){
  let newState = Object.assign({}, state);
  const { payload, type } = action;
  switch (type) {
    case CHANGE_CONNECTION_STATUS: {
      newState.isConnected = payload;
      break;
    }
    case REHYDRATE: {
      break;
    }
  }
  return newState;
};

export default networkReducer;
