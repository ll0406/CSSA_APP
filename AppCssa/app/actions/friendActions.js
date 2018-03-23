import {
  RECEIVE_FRIENDSLIST,
  REQUEST_FRIENDSLIST,
  REQUEST_FRIENDSLIST_FAILED,
} from '../constants';
import * as ENDPOINTS from "../endpoints";

export const requestFriendList = () => {
  return {
    type: REQUEST_FRIENDSLIST,
  }
}

export const fetchFriendsList = (uid, token) => dispatch => {
  dispatch({
    type: REQUEST_FRIENDSLIST
  });
  fetch(`${ENDPOINTS.BASE}${ENDPOINTS.GET_FRIENDSLIST}?uid=${uid}&token=${token}&pageSize=1000`)
    .then(res => res.text())
    .then(
      text => {
        const json = JSON.parse(text);
        if (json.success) {
          dispatch({
            type: RECEIVE_FRIENDSLIST,
            payload: json.datas,
          });
        } else {
          console.log("FETCH Failed"),
          dispatch({
            type: REQUEST_FRIENDSLIST_FAILED,
            error: json.error,
          })
        }
      },
      err => {
        dispatch({
          type: SERVER_ERROR,
        });
        console.error(err);
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
  fetch(`${ENDPOINTS.BASE}${ENDPOINTS.ADD_FRIEND_REQUEST}`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/html'
    },
    body: JSON.stringify(data)
  })
  .then(res => res.text())
  .then(
    text => {
      const json = JSON.parse(text);
      if (json.success) {
        console.log("requesting success");
      } else {
        console.log("requesting fail");
      }
    },
    err => {
      dispatch({
        type: SERVER_ERROR,
      });
      console.err("server err");
    }
  )
}

export const deleteFriend = (uid, friendid, token) => {
  const data = {
    uid,
    friendid,
    token,
  }
  fetch(`${ENDPOINTS.BASE}${ENDPOINTS.DELETE_FRIEND}`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/html'
    },
    body: JSON.stringify(data)
  })
  .then(res => res.text())
  .then(
    text => {
      const json = JSON.parse(text);
      if (json.success) {
        console.log("delete friend success");
      } else {
        console.log("delete friend fail");
      }
    },
    err => {
      dispatch({
        type: SERVER_ERROR,
      });
      console.err("server err");
    }
  )
}
