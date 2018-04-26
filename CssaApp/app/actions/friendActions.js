import {
  RECEIVE_FRIENDSLIST,
  REQUEST_FRIENDSLIST,
  REQUEST_FRIENDSLIST_FAILED,
} from '../constants';
import * as ENDPOINTS from "../endpoints";
import { safe } from '../helper';
import { apiCall } from './networkActions';

export const requestFriendList = () => {
  return {
    type: REQUEST_FRIENDSLIST,
  }
}

export const fetchFriendsList = (uid, token) => dispatch => {
  dispatch({
    type: REQUEST_FRIENDSLIST
  });

  safe(
    () => {
      apiCall(
        method = 'GET',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.GET_FRIENDSLIST}?uid=${uid}&token=${token}&pageSize=500`,
        success = (json) => {
          dispatch({
            type: RECEIVE_FRIENDSLIST,
            payload: json.datas,
          });
        },
        fail = (json) => {
          dispatch({
            type: REQUEST_FRIENDSLIST_FAILED,
            error: json.error,
          });
          Alert.alert('获取好友失败',json.error)
        }
      )
    }
  )
}

export const addFriendRequest = (uid, friendid, comment, token) => dispatch => {
  const data = {
    uid,
    friendid,
    comment,
    token,
  }
  safe(
    () => {
      apiCall(
        method = 'POST',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.ADD_FRIEND_REQUEST}`,
        success = (json) => {},
        fail = (json) => {
          Alert.alert('添加好友请求失败', json.error);
        },
        body = JSON.stringify(data),
      )
    }
  );
}

export const deleteFriend = (uid, friendid, token) => {
  const data = {
    uid,
    friendid,
    token,
  }

  safe(
    () => {
      apiCall(
        method = 'POST',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.DELETE_FRIEND}`,
        success = (json) => {},
        fail = (json) => {
          Alert.alert('删除好友失败', json.error);
        },
        body = JSON.stringify(data),
      )
    }
  );
}
