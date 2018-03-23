import {
  RECEIVE_COLLECTION, ADD_TO_COLLECTION,
  DELETE_FROM_COLLECTION, CLEAR_COLLECTION,
  REQUEST_COLLECTION,
    } from '../constants';
import { REHYDRATE } from 'redux-persist/constants';

const initialState={
  isFetching: false,
  errors: [],
  collectionList: [],
  tidList: [],
}

function collectionReducer(state = initialState, action){
  let newState = Object.assign({}, state);
  const {type, payload, error} = action;

  switch (type) {
    case REQUEST_COLLECTION: {
      newState.isFetching = true;
      break;
    }
    case RECEIVE_COLLECTION: {
      let actualPayload = payload;
      if (payload === null) {
        actualPayload = [];
      }
      newState.collectionList = actualPayload;
      newState.tidList = actualPayload.map(news => {
        return (news.tid);
      })
      newState.errors = [];
      newState.isFetching = false;
      break;
    }
    case ADD_TO_COLLECTION: {
      newState.collectionList = state.collectionList.concat(payload);
      newState.tidList = state.tidList.concat(payload.tid);
      break;
    }
    case DELETE_FROM_COLLECTION: {
      newState.collectionList = state.collectionList.filter(news => {
        return (JSON.stringify(news) !== JSON.stringify(payload))
      })
      newState.tidList = state.tidList.filter(tid => {
        return (payload.tid !== tid)
      })
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
};

export default collectionReducer;
