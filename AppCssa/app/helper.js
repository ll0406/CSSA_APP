import React from 'react';
import { NetInfo, Alert } from 'react-native';

export function safe(fetchFunc) {
  NetInfo.isConnected.fetch().then(
    isConnected => {
      if (isConnected) {
        fetchFunc();
      } else {
        setTimeout(
          () => {
            NetInfo.isConnected.fetch().then(
              isConnected => {
                if (isConnected) {
                  fetchFunc();
                } else {
                  NetInfo.getConnectionInfo().then((connectionInfo) => {
                    console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
                  });
                  Alert.alert('网络异常','请检查网络连接');
                }
              }
            )
          }, 2000
        )
      }
    }
  )
}
