import { Alert } from 'react-native'
import {
  CLASSMATE_REQUEST,
  RECEIVE_CLASS_COLLECTION,
  REQUEST_CLASS_COLLECTION_FAILED,
  RECEIVE_POSTS,
  RECEIVE_GROUPS,
} from '../constants';
import * as ENDPOINTS from "../endpoints";
import { safe } from '../helper';
import { apiCall } from './networkActions';
import { Actions } from 'react-native-router-flux';


export const addClass = (uid, classId, token) => dispatch => {
  const data = {
    uid,
    classid: eval(classId),
    token,
  }

  safe(
    () => {
      apiCall(
        method = 'POST',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.ADD_CLASS}`,
        success = (json) => {
            Actions.popTo('classmateHome');
        },
        fail = (json) => {
          Alert.alert('添加课程失败', json.error)
        },
        body = JSON.stringify(data),
      )
    }
  )
}

export const fetchCollection = (uid, token) => dispatch => {
  dispatch({
    type: CLASSMATE_REQUEST,
  });

  safe(
    () => {
      apiCall(
        method = 'GET',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.GET_CLASS_COLLECTION}?uid=${uid}&token=${token}&pageSize=100`,
        success = (json) => {
          dispatch(
            {type: RECEIVE_CLASS_COLLECTION,
            payload: json.datas}
          )
        },
        fail = (json) => {
          Alert.alert('获取课程失败', json.error);
        }
      )
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

  safe(
    () => {
      apiCall(
        method = 'POST',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.REQUEST_JOIN_GROUP}`,
        success = (json) => {},
        fail = (json) => {
          Alert.alert("请求加入失败", json.error)
        },
        body = JSON.stringify(data),
      )
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

  safe(
    () => {
      apiCall(
        method = 'POST',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.REQUEST_INVITE_GROUP}`,
        success = (json) => {},
        fail = (json) => {
          Alert.alert("邀请失败", json.error)
        },
        body = JSON.stringify(data),
      )
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

  safe(
    () => {
      apiCall(
        method = 'POST',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.CREATE_POST}`,
        success = (json) => {},
        fail = (json) => {
          Alert.alert('发表失败', json.error)
        },
        body = JSON.stringify(data),
      )
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

  safe(
    () => {
      apiCall(
        method = 'POST',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.MAKE_COMMENT}`,
        success = (json) => {},
        fail = (json) => {
          Alert.alert('评论失败', json.error)
        },
        body = JSON.stringify(data),
      )
    }
  );
}

export const delComment = (uid, postid, commentid, token) => {
  const data = {
    uid,
    postid,
    commentid,
    token,
  }

  safe(
    () => {
      apiCall(
        method = 'POST',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.DEL_COMMENT}`,
        success = (json) => {},
        fail = (json) => {
          Alert.alert('评论删除失败', json.error)
        },
        body = JSON.stringify(data),
      )
    }
  );
}

export const createGroup = (uid, groupName, groupIntro, tags, token) => {
  const data = {
    uid,
    groupName,
    groupIntro,
    tags,
    token,
  }

  safe(
    () => {
      apiCall(
        method = 'POST',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.CREATE_GROUP}`,
        success = (json) => {},
        fail = (json) => {
          Alert.alert("创建小组失败",json.error)
        },
        body = JSON.stringify(data),
      )
    }
  );
}

export const handleInvite = (nid, uid, groupid, result, token) => {
  const data = {
    nid,
    uid,
    groupid,
    result,
    token,
  }

  safe(
    () => {
      apiCall(
        method = 'POST',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.HANDLE_INVITE}`,
        success = (json) => {},
        fail = (json) => {
          Alert.alert("回复失败",json.error);
        },
        body = JSON.stringify(data),
      )
    }
  )
}

export const handleRequest = (nid, uid, memberuid, groupid, result, comment, token) => {
  const data = {
    nid,
    uid,
    memberuid,
    groupid,
    result,
    comment,
    token,
  }

  safe(
    () => {
      apiCall(
        method = 'POST',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.HANDLE_REQUEST}`,
        success = (json) => {},
        fail = (json) => {
          Alert.alert("回复失败",json.error);
        },
        body = JSON.stringify(data),
      )
    }
  )
}

export const leaveGroup = (uid, groupid, token) => {
  const data = {
    uid,
    groupid,
    token,
  }

  safe(
    () => {
      apiCall(
        method = 'POST',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.LEAVE_GROUP}`,
        success = (json) => {},
        fail = (json) => {
          Alert.alert("离开失败",json.error);
        },
        body = JSON.stringify(data),
      )
    }
  )
}
