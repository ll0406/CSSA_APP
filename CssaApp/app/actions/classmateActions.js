import { Alert } from 'react-native'
import {
  CLASSMATE_REQUEST,
  RECEIVE_CLASS_COLLECTION,
  REQUEST_CLASS_COLLECTION_FAILED,
  RECEIVE_POSTS,
  RECEIVE_GROUPS,
} from '../constants';
import * as ENDPOINTS from "../endpoints";
import { Actions } from 'react-native-router-flux';


export const addClass = (uid, classId, token) => dispatch => {
  const data = {
    uid,
    classid: eval(classId),
    token,
  }
  fetch(`${ENDPOINTS.BASE}${ENDPOINTS.ADD_CLASS}`, {
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
        Actions.popTo('classmateHome');
      } else {
        console.log(json);
        Alert.alert('添加课程失败', json.error)
      }
    },
    err => {
      dispatch({
        type: SERVER_ERROR,
      });
      Alert.alert("服务器出错了！")
    }
  )
}

export const fetchCollection = (uid, token) => dispatch => {
  dispatch({
    type: CLASSMATE_REQUEST,
  });
  fetch(`${ENDPOINTS.BASE}${ENDPOINTS.GET_CLASS_COLLECTION}?uid=${uid}&token=${token}&pageSize=100`)
    .then(res => res.text())
    .then(
      text => {
        const json = JSON.parse(text);
        if (json.success) {
          dispatch(
            {type: RECEIVE_CLASS_COLLECTION,
            payload: json.datas}
          )
        } else {
          console.log("FETCH Class Failed");
          dispatch({
            type: REQUEST_CLASS_COLLECTION_FAILED,
            error: json.error
          });
       }
      },
      err => {
        console.log(err);
        Alert.alert("服务器出错了！")
      }
    )
}

export const requestJoinGroup = (uid, groupid, message, token) => {
  const data = {
    uid,
    groupid,
    message,
    token,
  }
  fetch(`${ENDPOINTS.BASE}${ENDPOINTS.REQUEST_JOIN_GROUP}`, {
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
        console.log("request join success");
      } else {
        console.log(json);
        console.log("request join fail");
        Alert.alert("请求加入失败", json.error)
      }
    },
    err => {
      dispatch({
        type: SERVER_ERROR,
      });
      console.err("server err");
      Alert.alert("服务器出错了！")
    }
  )
}

export const requestInviteGroup = (uid, memberuid, groupid, token) => {
  const data = {
    uid,
    memberuid,
    groupid,
    token,
  }
  fetch(`${ENDPOINTS.BASE}${ENDPOINTS.REQUEST_INVITE_GROUP}`, {
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
        console.log("request invite success");
      } else {
        console.log(json);
        console.log("request invite fail");
        Alert.alert("邀请失败", json.error)
      }
    },
    err => {
      dispatch({
        type: SERVER_ERROR,
      });
      console.err("server err");
      Alert.alert("服务器出错了！")
    }
  )
}

//Actions to Create a Post in ClassDetail Page
export const createPost = (uid, classid, subject, content, token) => {
  const data = {
    uid,
    classid,
    subject,
    content,
    token,
  }
  fetch(`${ENDPOINTS.BASE}${ENDPOINTS.CREATE_POST}`, {
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
        console.log("creatPost success");
      } else {
        console.log(json);
        console.log("creatPost fail");
        Alert.alert('发表失败', json.error)
      }
    },
    err => {
      dispatch({
        type: SERVER_ERROR,
      });
      console.log("server err");
      Alert.alert("服务器出错了！")
    }
  )
}

//Make comment
export const makeComment = (uid, postid, touid, content, token) => {
  const data = {
    uid,
    postid,
    touid,
    content,
    token,
  }
  fetch(`${ENDPOINTS.BASE}${ENDPOINTS.MAKE_COMMENT}`, {
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
        console.log("comment success");
      } else {
        console.log(json);
        console.log("comment fail");
      }
    },
    err => {
      dispatch({
        type: SERVER_ERROR,
      });
      console.log("server err");
      Alert.alert("服务器出错了！")
    }
  )
}

export const delComment = (uid, postid, commentid, token) => {
  const data = {
    uid,
    postid,
    commentid,
    token,
  }
  fetch(`${ENDPOINTS.BASE}${ENDPOINTS.DEL_COMMENT}`, {
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
        console.log("comment del success");
      } else {
        console.log(json);
        console.log("comment del fail");
      }
    },
    err => {
      dispatch({
        type: SERVER_ERROR,
      });
      console.log("server err")
      Alert.alert("服务器出错了！")
    }
  )
}

export const createGroup = (uid, groupName, groupIntro, tags, token) => {
  const data = {
    uid,
    groupName,
    groupIntro,
    tags,
    token,
  }
  fetch(`${ENDPOINTS.BASE}${ENDPOINTS.CREATE_GROUP}`, {
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
        console.log("create group success");
      } else {
        console.log(json);
        console.log("create group success fail");
        Alert.alert("创建失败",json.error)
      }
    },
    err => {
      dispatch({
        type: SERVER_ERROR,
      });
      console.log("server err");
      Alert.alert("服务器出错了！")
    }
  )
}
