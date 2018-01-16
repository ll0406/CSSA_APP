import {FETCH_LOGIN, RECEIVE_LOGIN, LOGIN_ERROR, SERVER_ERROR,
  INVALIDATE_USER, CLEAR_LOGIN_ERROR, UPDATE_SUCCESS, UPDATE_FAIL, EDIT_BIRTH} from '../constants';
import * as ENDPOINTS from "../endpoints";
import { apiCall } from './networkActions'
import { Actions } from 'react-native-router-flux';
import { Alert } from 'react-native';

export const requestLogin = () => {
  return {
    type: FETCH_LOGIN,
  }
}

export const clearLoginError = () => ({
    type: CLEAR_LOGIN_ERROR,
});

export const receiveLogin = (datas) => {
  return {
    payload: datas,
    type: RECEIVE_LOGIN,
  }
}


export const fetchLogin = (user, pass) => dispatch => {
  let formData = new FormData();
  formData.append('useracc', user);
  formData.append('userpw', pass);
  dispatch(requestLogin());
  apiCall(
    method = 'POST',
    endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.LOGIN}`,
    success = (json) => {
      dispatch(receiveLogin(json.datas))
      Actions.newsPage();
    },
    fail = (json) => {
      dispatch({
        type: LOGIN_ERROR,
        error: json.error,
      })
    },
    body = formData,
    headers = {
      'Content-Type': 'multipart/form-data',
      'Accept': 'text/html'
    },
  )
};

export const userUpdate = (data) => dispatch => {
  apiCall(
    method = 'POST',
    endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.USER_UPDATE}`,
    success = (json) => {
      dispatch({
        type: UPDATE_SUCCESS,
      })
    },
    fail = (json) => {
      Alert.alert("更新失败", json.error)
    },
    body = JSON.stringify(data),
  )

  // fetch(`${ENDPOINTS.BASE}${ENDPOINTS.USER_UPDATE}`, {
  //   method: 'POST',
  //   mode: 'cors',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Accept': 'text/html'
  //   },
  //   body: JSON.stringify(data)
  // })
  // .then(res => res.text())
  // .then(
  //   text => {
  //     const json = JSON.parse(text);
  //     dispatch({
  //       type: UPDATE_SUCCESS,
  //     })
  //   },
  //   err => {
  //     dispatch({
  //       type: UPDATE_FAIL,
  //     })
  //     console.error(err);
  //   }
  // );
}

export const avatarUpdate = (base64Data, uid, token) => dispatch => {
  let data = {
    uid: uid,
    imgBase64: base64Data,
    token: token
  }


  fetch(`${ENDPOINTS.BASE}${ENDPOINTS.AVATAR_UPDATE}`, {
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
      if (json.success){
        dispatch({
          type: UPDATE_SUCCESS,
        })
      } else {
        dispatch({
          type: UPDATE_FAIL,
        })
      }
    },
    err => {
      dispatch({
        type: UPDATE_FAIL,
      })
      console.log("AVATAR UPDATE ERROR!!!!!!")
      console.error(err);
    }
  );
}


export const userAuth = (uid, token) => dispatch => {
  dispatch(requestLogin());
  apiCall(
    method = 'GET',
    endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.USER_AUTH}?uid=${uid}&token=${token}`,
    success = (json) => {
      dispatch(receiveLogin(json.datas));
      dispatch(clearLoginError());
      Actions.newsPage();
    },
    fail = (json) => {
      dispatch(invalidateUser);
      dispatch({
        type: LOGIN_ERROR,
        error: json.error,
      })
    }
  )

  // fetch(`${ENDPOINTS.BASE}${ENDPOINTS.USER_AUTH}?uid=${uid}&token=${token}`)
  //   .then(res => res.text())
  //   .then(
  //     text => {
  //       const json = JSON.parse(text);
  //       if (json.success){
  //         dispatch(receiveLogin(json.datas));
  //         dispatch(clearLoginError());
  //         Actions.newsPage();
  //       } else {
  //         dispatch(invalidateUser);
  //         dispatch({
  //           type: LOGIN_ERROR,
  //           error: json.error,
  //         })
  //       }
  //     },
  //     err => {
  //       dispatch(invalidateUser);
  //       dispatch({
  //         type: SERVER_ERROR,
  //       })
  //       Alert.alert(err);
  //     }
  //   )
}

export const getMyInfo = (uid, token) => dispatch => {
  fetch(`${ENDPOINTS.BASE}${ENDPOINTS.USER_AUTH}?uid=${uid}&token=${token}`)
    .then(res => res.text())
    .then(
      text => {
        const json = JSON.parse(text);
        if (json.success){
          dispatch(receiveLogin(json.datas));
          dispatch(clearLoginError());
        } else {
          dispatch(invalidateUser);
          dispatch({
            type: LOGIN_ERROR,
            error: json.error,
          })
        }
      },
      err => {
        dispatch(invalidateUser);
        dispatch({
          type: SERVER_ERROR,
        })
        console.error(err);
      }
    )
}

export const infoUpdate = (type, uid, key, value, token) => dispatch => {
  let endpoint;
  let data = {
    uid,
    key,
    value,
    token
  }
  if (type === 'string' && key !== 'dateOfBirth') {
    endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.EDIT_INFOSTRING}`
  } else if (type === 'string' && key === 'dateOfBirth') {
    endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.EDIT_BIRTH}`
    //Special case for birthday
    data = {
      uid,
      birthyear: value[0],
      birthmonth: value[1],
      birthday: value[2],
      token
    }
  } else {
    endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.EDIT_INFOINT}`
  }

  fetch(endpoint, {
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
      if (json.success){
        dispatch({
          type: UPDATE_SUCCESS,
        })
        dispatch(getMyInfo(uid, token))
        setTimeout(() => {
          Actions.pop();
        }, 1000)
      } else {
        dispatch({
          type: UPDATE_FAIL,
        })
      }
    },
    err => {
      console.log("INFO UPDATE ERROR!!!!!!")
      console.error(err);
    }
  );
}

export const pwdChange = (uid, oldpw, newpw, token) => {
  let data = {
    uid,
    oldpw,
    newpw,
    token
  }
  fetch(`${ENDPOINTS.BASE}${ENDPOINTS.EDIT_PWD}`, {
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
      if (json.success){

        setTimeout(() => {
          Actions.pop();
        }, 1000)
      } else {
        Alert.alert('更改密码失败', json.error);
      }
    },
    err => {
      console.log("Fail to change pwd")
      console.log(json)
    }
  );
}

export const register = (username, password, email) => {
  let data = {
    username,
    password,
    email
  }
  fetch(`${ENDPOINTS.BASE}${ENDPOINTS.REGISTER}`, {
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
      if (json.success){
        console.log("Register scuess")
        setTimeout(() => {
          Actions.pop();
        }, 150)
      } else {
        Alert.alert('注册失败', json.error);
      }
    },
    err => {
      console.log("Fail to change pwd")
      console.log(json)
      Alert.alert('服务器出错了!', '请稍后再试');
    }
  );
}


export const invalidateUser = () => {
  return {
    type: INVALIDATE_USER,
  }
}
