import {
  FETCH_LOGIN, RECEIVE_LOGIN, LOGIN_ERROR, SERVER_ERROR, INVALIDATE_USER,
  GCHANGE, CLEAR_LOGIN_ERROR, SET_BIRTHDAY, UPDATE_SUCCESS, UPDATE_FAIL ,
  DISMISS_ALERT,
    } from '../constants';
import { REHYDRATE } from 'redux-persist/constants';

const initialState= {
  isFetching: false,
  errors: [],
  userData: undefined,
  changeDetected: false,
  alert: undefined,
}

function userReducer(state = initialState, action){
  let newState = Object.assign({}, state);
  const {type, payload, error} = action;

  switch (type) {
    case FETCH_LOGIN: {
      newState.isFetching = true;
      break;
    }
    case RECEIVE_LOGIN: {
      newState.userData = payload;
      newState.errors = [];
      newState.isFetching = false;
      break;
    }
    case LOGIN_ERROR: {
      newState.errors = [];
      newState.errors.push(error);
      newState.isFetching = false;
      break;
    }
    case SERVER_ERROR: {
      newState.errors.push("服务器好像出错了QAQ");
      newState.isFetching = false;
      break;
    }
    case INVALIDATE_USER: {
      newState.userData = undefined;
      newState.changeDetected = false;
      break;
    }
    case CLEAR_LOGIN_ERROR: {
      newState.errors = [];
      break;
    }
    case GCHANGE: {
      newState.userData.gender = eval(payload); //gender should be int
      newState.changeDetected = true;
      break;
    }
    case SET_BIRTHDAY: {
      newState.userData.dateOfBirth = payload;
      newState.changeDetected = true;
      break;
    }
    case UPDATE_SUCCESS: {
      newState.changeDetected = false
      newState.alert = {
        type: 'success',
        title: '成功',
        message: '成功更新个人资料 σ`∀´)σ!!!'
      }
      break;
    }
    case UPDATE_FAIL: {
      newState.alert = {
        type: 'success',
        title: '失败',
        message: '服务器好像坏掉了呢 இдஇ'
      };
      break;
    }
    case DISMISS_ALERT: {
      newState.alert = undefined
      break;
    }
    case REHYDRATE: {
      const savedData =  action.payload ? action.payload.userReducer : initialState;
      newState = {...savedData};
      //Prevent changeDetected rehydrate
      newState.changeDetected = false;
      newState.errors = [];
      newState.isFetching = false;
      break;
    }
  }
  return newState;
};

export default userReducer;
