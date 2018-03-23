import {
  REQUEST_COLLECTION,
  ADD_TO_COLLECTION,
  RECEIVE_COLLECTION,
  DELETE_FROM_COLLECTION,
} from '../constants';
import * as ENDPOINTS from "../endpoints";

//Will implement page size and page index later
export const fetchThreadCollection = (uid, token) => dispatch => {
  dispatch({ type: REQUEST_COLLECTION });



  fetch(`${ENDPOINTS.BASE}${ENDPOINTS.GET_THREAD_COLLECTION}?uid=${uid}&token=${token}&pageSize=1000`)
  .then(res => res.text())
  .then(
    text => {
      console.log("COLLECTION RES")
      console.log(text);
      const json = JSON.parse(text);
      console.log(json.datas)
      if (json.success) {
        dispatch({
          type: RECEIVE_COLLECTION,
          payload: json.datas
        })
      } else {
        console.error('SERVER ERROR');
      }
    },
    err => {
      console.error(err);
    }
  )
}

export const requestDeleteThread = (uid, tid, subject, author, dateline, token) => dispatch => {
  const data = {
    uid,
    tids: [tid].join(','),
    token
  }
  fetch(`${ENDPOINTS.BASE}${ENDPOINTS.DELETE_THREAD_FROM_COLLLECTION}`, {
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
        console.log("Delete success");
        console.log(json)
        dispatch({
          type: DELETE_FROM_COLLECTION,
          payload: {
            tid,
            subject,
            author,
            dateline
          },
        });
      } else {
        console.log("Delete fail");
      }
    },
    err => {
      console.err("server err");
    }
  )
}

export const requestAddThread = (uid, tid, subject, author, dateline, token) => dispatch => {
  const data = {
    uid,
    tid,
    subject,
    author,
    dateline,
    token
  }
  fetch(`${ENDPOINTS.BASE}${ENDPOINTS.ADD_THREAD_TO_COLLECTION}`, {
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
        console.log("Add success");
        dispatch({
          type: ADD_TO_COLLECTION,
          payload: {
            tid,
            subject,
            author,
            dateline
          },
        });
      } else {
        console.log("Add fail");
        console.log(text);
      }
    },
    err => {
      console.err("server err");
    }
  )
}
