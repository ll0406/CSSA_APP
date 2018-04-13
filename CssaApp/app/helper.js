import React from 'react';
import { NetInfo, Alert } from 'react-native';

export function safe(fetchFunc) {
  NetInfo.isConnected.fetch().then(
    isConnected => {
      if (isConnected) {
        fetchFunc();
      } else {
        console.log("NO CONNECTION");
      }
    }
  )
}
