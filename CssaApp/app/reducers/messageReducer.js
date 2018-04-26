import { RECEIVE_MESSAGELIST, RECEIVE_NEW_MESSAGE,
  REQUEST_MESSAGELIST, REQUEST_MESSAGE,
  RECEIVE_OLD_MESSAGE, CLEAR_MESSAGES, SET_NEW_NUM,
  RECEIVE_SYSMESS } from '../constants';
import { REHYDRATE } from 'redux-persist/constants';

const initialState = {
  isFetchingList: false,
  isFetchingSysMess: false,
  isFetchingMessage: false,
  messageList: [],
  sysMessage: [],
  initialMessages: undefined,
  oldMessages: undefined,
}

function messageReducer (state = initialState, action) {
  let newState = Object.assign({}, state);
  const { type, payload, error } = action;

  switch (type) {
    case REQUEST_MESSAGELIST: {
      newState.isFetchingList = true;
      newState.isFetchingSysMess = true;
      break;
    }
    case REQUEST_MESSAGE: {
      newState.isFetchingMessage = true;
      break;
    }

    case RECEIVE_MESSAGELIST: {
      newState.isFetchingList = false;
      newState.messageList = payload;
      break;
    }

    case RECEIVE_SYSMESS: {
      newState.isFetchingSysMess = false;
      newState.sysMessage = payload;
      break;
    }

    case RECEIVE_NEW_MESSAGE: {
      newState.isFetchingMessage = false;
      newState.initialMessages = payload.messages;
      break;
    }
    case RECEIVE_OLD_MESSAGE: {
      newState.isFetchingMessage = false;
      newState.oldMessages = payload.messages;
      break;
    }
    case CLEAR_MESSAGES: {
      newState.initialMessages = undefined;
      newState.oldMessages = undefined;
      break;
    }
    case SET_NEW_NUM: {
      newState.newNum = payload;
      break;
    }
    case REHYDRATE: {
      const savedData = payload ? payload.messageReducer : initialState;
      newState = { ...savedData };
      break;
    }
  }
  return newState;
}

export default messageReducer;
