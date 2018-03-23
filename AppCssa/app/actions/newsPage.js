import {REQUEST_NEWS, SET_NEWSOFFSET,
  RECEIVE_NEWS, RECEIVE_NEWS_ERROR,
  CLEAN_LIST,
} from '../constants';
import * as ENDPOINTS from '../endpoints';
import { apiCall } from './networkActions';
import { safe } from '../helper';
import { Alert } from 'react-native';


export const setNewsOffset = (offset) => ({
  type: SET_NEWSOFFSET,
  payload: offset
});

export const receiveNews = json => {
  return {
      payload: json.datas.map(thread => {
          return {
            tid: thread.tid,
            author: thread.author,
            dateline: thread.dateline,
            subject: thread.subject,
            isCollected: thread.isCollected,
            url: thread.url,
          }
        }),
      type: RECEIVE_NEWS,
  }
};

export const requestNews = () => {
  return {
    type: REQUEST_NEWS,
  }
}

export const fetchNews = (current_page_index = 0, uid) => dispatch => {
  dispatch(requestNews());
  safe(
    () => {
      apiCall(
        method = 'GET',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.GET_OFFICIAL_THREAD}?uid=${uid}&pageIndex=${current_page_index+1}&pageSize=10`,
        success = (json) => {
          dispatch(receiveNews(json));
        },
        fail = (json) => {
          Alert.alert('获取失败', json.error)
        }
      )
    }
  )
};

export const refreshNews = (uid) => dispatch => {
  dispatch(requestNews());
  safe(
    () => {
      apiCall(
        method = 'GET',
        endpoint = `${ENDPOINTS.BASE}${ENDPOINTS.GET_OFFICIAL_THREAD}?uid=${uid}&pageIndex=1&pageSize=10`,
        success = (json) => {
          dispatch(
            {
              type: CLEAN_LIST,
            }
          );
          dispatch(receiveNews(json));
        },
        fail = (json) => {
          Alert.alert('更新失败', json.error)
        }
      )
    }
  )
};
