import {FETCH_LOGIN, RECEIVE_LOGIN, LOGIN_ERROR, SERVER_ERROR,
  INVALIDATE_USER, CLEAR_LOGIN_ERROR, UPDATE_SUCCESS, UPDATE_FAIL, EDIT_BIRTH
} from '../constants';
import * as ENDPOINTS from "../endpoints";
import { safe } from '../helper';
import { apiCall, startFetching, endFetching } from './networkActions'
import { Actions } from 'react-native-router-flux';
import { Alert } from 'react-native';

export const requestLogin = () => {
  return {
    type: RECEIVE_LOGIN,
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
  dispatch(startFetching());

  // apiCall(
  //   method = 'POST',
  //   endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.LOGIN}`,
  //   success = (json) => {
  //     dispatch(endFetching());
  //     dispatch(receiveLogin(json.datas))
  //     Actions.newsPage();
  //   },
  //   fail = (json) => {
  //     dispatch(endFetching());
  //     Alert.alert('错误',json.error);
  //   },
  //   body = formData,
  //   headers = {
  //     'Content-Type': 'multipart/form-data',
  //     'Accept': 'text/html'
  //   },
  // );

  safe(() => {
    apiCall(
      method = 'POST',
      endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.LOGIN}`,
      success = (json) => {
        dispatch(endFetching());
        dispatch(receiveLogin(json.datas))
        Actions.newsPage();
      },
      fail = (json) => {
        dispatch(endFetching());
        Alert.alert('错误',json.error);
      },
      body = formData,
      headers = {
        'Content-Type': 'multipart/form-data',
        'Accept': 'text/html'
      },
    );
  }
  );
};

export const userUpdate = (data) => dispatch => {
  safe(() => {
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
  })
}

export const avatarUpdate = (base64Data, uid, token) => dispatch => {
  let data = {
    uid: uid,
    imgBase64: base64Data,
    token: token
  }
  safe(
    () => {
      apiCall(
        method = 'POST',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.AVATAR_UPDATE}`,
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
    }
  )
}


export const userAuth = (uid, token) => dispatch => {
  dispatch(requestLogin());
  safe(
    () => {
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
    }
  )
}

export const getMyInfo = (uid, token) => dispatch => {
  safe(
    () => {
      apiCall(
        method = 'GET',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.USER_AUTH}?uid=${uid}&token=${token}`,
        success = (json) => {
          dispatch(receiveLogin(json.datas));
          dispatch(clearLoginError());
        },
        fail = (json) => {
          dispatch(invalidateUser);
          dispatch({
            type: LOGIN_ERROR,
            error: json.error,
          })
        }
      )
    })
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

  safe(
    () => {
      apiCall(
        method = 'POST',
        endpoint = endpoint,
        success = (json) => {
          dispatch({
            type: UPDATE_SUCCESS,
          })
          dispatch(getMyInfo(uid, token))
          setTimeout(() => {
            Actions.pop();
          }, 1000)
        },
        fail = (json) => {
          Alert.alert("更新失败", json.error)
        },
        body = JSON.stringify(data),
      )
    }
  )
}

export const pwdChange = (uid, oldpw, newpw, token) => {
  let data = {
    uid,
    oldpw,
    newpw,
    token
  }

  safe(
    () => {
      apiCall(
        method = 'POST',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.EDIT_PWD}`,
        success = (json) => {
            setTimeout(() => {
              Actions.pop();
            }, 1000)
        },
        fail = (json) => {
          Alert.alert('更改密码失败', json.error);
        },
        body = JSON.stringify(data),
      )
    }
  )
}

export const register = (username, password, email) => {
  let data = {
    username,
    password,
    email
  }
  safe(
    () => {
      apiCall(
        method = 'POST',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.REGISTER}`,
        success = (json) => {
            setTimeout(() => {
              Actions.pop();
            }, 150)
        },
        fail = (json) => {
          Alert.alert('注册失败', json.error);
        },
        body = JSON.stringify(data),
      )
    }
  )
}


export const invalidateUser = () => {
  return {
    type: INVALIDATE_USER,
  }
}
