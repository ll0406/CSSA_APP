import { Alert } from 'react-native';

import { CHANGE_CONNECTION_STATUS, FETCHING_CHANGE } from '../constants';

//When a network's status changed, connectionState is called to change the
//status in network Reducer

//### Not using it right now due to the lack of statbility of NetInfo
export const connectionState = ({ status }) => {
  return { type: CHANGE_CONNECTION_STATUS, payload: status };
};

export const startFetching = () => {
  return {
    payload: true,
    type: FETCHING_CHANGE,
  }
}

export const endFetching = () => {
  return {
    payload: false,
    type: FETCHING_CHANGE,
  }
}

//This is a integrated API Call, all api calls should be going through here
//First it checks the connected state
//Furthermore, it should first decides it behavior on the method: "GET" or "POST"
//Default type of headers is given as application/json and text/html
//Both Success and Fail callback should take tha json as the argument
export const apiCall = (
  method,
  endpoint,
  success,
  fail,
  body = null,
  headers = {
    'Content-Type': 'application/json',
    'Accept': 'text/html'
  },
) => {
    if (method == 'GET') {
      fetch(endpoint).then(res => res.text()).then(
          text => {
            const json = JSON.parse(text);
            if (json.success) {
              success(json);
            } else {
              fail(json);
            }
          },
          err => {
            console.log(err)
          }
        )
    } else if (method == "POST") {
      fetch(endpoint, {
        method,
        mode: 'cors',
        headers,
        body,
      }).then(res => res.text()).then(
        text => {
          const json = JSON.parse(text);
          if (json.success){
            success(json);
          } else {
            fail(json);
          }
        },
        err => {
          console.log(err)
        }
      )
    }
}
