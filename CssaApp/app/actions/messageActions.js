import { RECEIVE_MESSAGELIST, RECEIVE_NEW_MESSAGE,
  REQUEST_MESSAGELIST, REQUEST_MESSAGE, DELETE_MESSAGE,
  RECEIVE_OLD_MESSAGE, SET_NEW_NUM, RECEIVE_SYSMESS } from '../constants';
import * as ENDPOINTS from '../endpoints';
import { Actions } from 'react-native-router-flux';
import { apiCall } from './networkActions';
import { safe } from '../helper';
import { Alert } from 'react-native';

export const fetchMessageList = (uid, token) => dispatch => {
  dispatch({ type: REQUEST_MESSAGELIST });
  safe(
    () => {
      apiCall(
        method = 'GET',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.GET_MESSAGE_LIST}?uid=${uid}&token=${token}&pageSize=500`,
        success = (json) => {
          const messageList = json.datas.map(
            message => {
              return (
                {
                  avatar: message.avatar,
                  plid: message.plid,
                  hasNew: message.hasnew,
                  creatorUsername: message.creatorusername,
                  lastAuthor: message.lastauthor,
                  members: message.members,
                  pmType: message.pmtype,
                  subject: message.subject,
                  dateRange: message.daterange,
                  pmNum: message.pmnum,
                  toUsername: message.tousername,
                  summary: message.summary,
                }
              )
            }
          );
          dispatch({
            type: RECEIVE_MESSAGELIST,
            payload: messageList
          })
        },
        fail = (json) => {
          Alert.alert('获取列表失败',json.error)
        }
      )
    })

    safe(
      () => {
        apiCall(
          method = 'GET',
          endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.SYSTEM_MESSAGE}?uid=${uid}&token=${token}&pageSize=100`,
          success = (json) => {
            const messageList = json.datas.map(
              message => {
                return (
                  {
                    is_new: message.is_new,
                    category: message.category,
                    type: message.type,
                    authorid: message.authorid,
                    author: message.author,
                    content: message.content,
                    dateline: message.dateline,
                    from_id: message.from_id,
                    from_type: message.from_type,
                    delstatus: message.delstatus,
                  }
                )
              }
            );
            dispatch({
              type: RECEIVE_SYSMESS,
              payload: messageList
            })
          },
          fail = (json) => {
            Alert.alert('获取列表失败',json.error)
          }
        )
      });
}

export const fetchMessage = (uid, plid, daterange, type, page, pageSize, token, fetchType) => dispatch => {
  dispatch({ type: REQUEST_MESSAGE });

  safe(
    () => {
      apiCall(
        method = 'GET',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.GET_MESSAGE}?uid=${uid}&plid=${plid}&daterange=${daterange}&type=${type}&page=${page}&pageSize=${pageSize}&token=${token}`,
        success = (json) => {
          const messageData = json.datas.map(message => {
            return {
              _id: message.pmid,
              text: message.message,
              createdAt: new Date(eval(message.dateline)*1000),
              user: {
                _id: eval(message.authorid),
                name: message.author,
                avatar: message.authoravatar,
              },
              pmid: message.pmid,
            }
          });
          const data = {
            messages: messageData.reverse(),
          }
          if (fetchType === "new") {
            dispatch({
              type: RECEIVE_NEW_MESSAGE,
              payload: data,
            })
          }
        },
        fail = (json) => {
          Alert.alert('获取聊天失败',json.error)
        }
      )
    });
}


export const requestDeleteMessage = (uid, plids, types, token) => dispatch => {
  const data = {
    uid,
    plids: plids.join(),
    types: types.join(),
    token
  }

  safe(
    () => {
      apiCall(
        method = 'POST',
        endpoint = endpoint,
        success = (json) => {
          dispatch({
            type: DELETE_MESSAGE,
            payload: plids,
          });
        },
        fail = (json) => {
          Alert.alert("删除失败", json.error)
        },
        body = JSON.stringify(data),
      )
    });
}


export const requestMessageByOffset = (uid, plid, type, pmid, offset, token) => dispatch => {
  safe(
    () => {
      apiCall(
        method = 'GET',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.GET_MESSAGE_BYOFFSET}?uid=${uid}&plid=${plid}&type=${type}&pmid=${pmid}&offset=${offset}&token=${token}`,
        success = (json) => {
          const messageData = json.datas.map(message => {
            return {
              _id: message.pmid,
              text: message.message,
              createdAt: new Date(eval(message.dateline)*1000),
              user: {
                _id: eval(message.authorid),
                name: message.author,
                avatar: message.authoravatar,
              },
              pmid: message.pmid,
            }
          });
          const data = {
            messages: messageData.reverse(),
          }
          if (pmid === 0) {
            dispatch({
              type: RECEIVE_NEW_MESSAGE,
              payload: data,
            })
          } else {
            dispatch({
              type: RECEIVE_OLD_MESSAGE,
              payload: data,
            })
          }
        },
        fail = (json) => {
          Alert.alert('获取聊天失败',json.error)
        }
      )
    });
}

export const replyMessage = (uid, username, plid, message, token) => dispatch => {
  const data = {
    uid,
    username,
    plid,
    message,
    token
  }
  console.log(message);
  fetch(`${ENDPOINTS.BASE}${ENDPOINTS.REPLY}`, {
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
        console.log("replying success");
      } else {
        console.log("replying fail");
      }
    },
    err => {
      console.err("server err");
    }
  )
}

export const createMessage = (uid, username, touids, subject, message, token) => {
  const data = {
    uid,
    username,
    touids: touids.join(','),
    subject,
    message,
    token
  }

  safe(
    () => {
      apiCall(
        method = 'POST',
        endpoint = endpoint,
        success = (json) => {
          Actions.pop();
        },
        fail = (json) => {
          Alert.alert("创建聊天失败", json.error)
        },
        body = JSON.stringify(data),
      )
    });
}

export const setMessageRead = (uid, plids, types ,token) => dispatch => {
  const data = {
    uid,
    plids: plids.join(),
    types: types.join(),
    token
  }

  safe(
    () => {
      apiCall(
        method = 'POST',
        endpoint = endpoint,
        success = (json) => {
        },
        fail = (json) => {
          Alert.alert("失败", json.error)
        },
        body = JSON.stringify(data),
      )
    });
}
