import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  AlertIOS
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import {Col, Row, Grid} from 'react-native-easy-grid';
import { handleInvite, handleRequest } from '../actions/classmateActions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class Confirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOptions: true
    }
  }

  componentDidMount() {
    const { confirmMessage } = this.props
    console.log(confirmMessage)
    if (confirmMessage.type === '系统消息') {
      this.setState({
        showOptions: false,
      })
    }
  }

  handleConfirm = () => {
    const { confirmMessage, user } = this.props
    const type = this.props.confirmMessage.type;
    switch(confirmMessage.type) {
      case '加组请求': {
        AlertIOS.prompt(
          '同意理由',
          '请输入你的处理理由',
          [
            {text: '取消', onPress: () => {}, style: 'cancel'},
            {text: '发送', onPress: message =>
            handleRequest(
              confirmMessage.id,
              user.uid,
              confirmMessage.authorid,
              confirmMessage.extra,
              1,
              message,
              user.token)},
          ],
          'plain-text'
        );
        break;
      }
      case '好友请求': {
        break;
      }
      case '加组邀请': {
        handleInvite(
          confirmMessage.id,
          user.uid,
          confirmMessage.extra,
          1,
          user.token
        );
        break;
      }
    }

  }

  handleDecline = () => {
    const { confirmMessage, user } = this.props
    const type = this.props.confirmMessage.type;
    switch(confirmMessage.type) {
      case '加组请求': {
        AlertIOS.prompt(
          '拒绝理由',
          '请输入你的处理理由',
          [
            {text: '取消', onPress: () => {}, style: 'cancel'},
            {text: '发送', onPress: message =>
            handleRequest(
              confirmMessage.id,
              user.uid,
              confirmMessage.authorid,
              confirmMessage.extra,
              0,
              message,
              user.token
            )},
          ],
          'plain-text'
        );
        break;
      }
      case '好友请求': {
        break;
      }
      case '加组邀请': {
        handleInvite(
          confirmMessage.id,
          user.uid,
          confirmMessage.extra,
          0,
          user.token
        );
        break;
      }
    }
  }


  render() {
    const { confirmMessage } = this.props;
    const { showOptions } = this.state;
    return (
      <View style={{flex:1, backgroundColor: '#cf6f6a'}}>

        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => Actions.pop()}
          >
            <Image
              style={styles.backButton}
              source={require('../img/leftArrow-white.png')}
              />
          </TouchableOpacity>

          <Text
            style={styles.headerText}
            >
              {confirmMessage.from_type}
          </Text>
        </View>

        <View style={styles.infoView}>
          <View style={styles.picContainer}>
            <Image
              style={styles.profilePic}
              source={{uri: `http://www.bucssa.net/uc_server/data/avatar/000/00/00/${confirmMessage.authorid}_avatar_big.jpg?random_number=${new Date().getTime()}`}}
              />
          </View>

          <View style={styles.detailView}>
            <Text style={{fontSize: 30, color: 'white', marginTop: 30, fontWeight: 'bold'}}>
              {confirmMessage.author}
            </Text>

            <Text style={{fontSize: 20, color: 'white', marginTop: 10}}>
              {confirmMessage.content}
            </Text>
          </View>
          {
            showOptions &&
              <View style={styles.actionView}>
                <TouchableOpacity style={styles.actionButton} onPress={this.handleDecline}>
                  <Text style={{fontSize: 25, color: 'white', fontWeight: 'bold'}}>
                    拒绝
                  </Text>
                </TouchableOpacity>
                <View style={styles.buttonSeparator}>
                </View>
                <TouchableOpacity style={styles.actionButton} onPress={this.handleConfirm}>
                  <Text style={{fontSize: 25, color: 'white', fontWeight: 'bold'}}>
                    同意
                  </Text>
                </TouchableOpacity>
              </View>
          }

        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  topBar: {
    height: windowHeight * (124/1334),
    backgroundColor: 'transparent',
    alignItems: 'center',
    zIndex: 2,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    position: 'absolute',
    bottom: windowHeight * (30/1334),
  },
  infoView: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    height: windowHeight * (1210/1334),
  },
  picContainer: {
    marginTop: windowHeight * (100/1334),
    height: windowHeight * (400/1334),
    width: windowHeight * (400/1334),
    borderRadius: windowHeight * (200/1334),
    overflow: 'hidden'
  },
  profilePic: {
    height: windowHeight * (400/1334),
    width: windowHeight * (400/1334),
  },
  buttonContainer: {
    height: windowHeight * (50/1334),
    width: windowWidth * (50/1334),
    position: 'absolute',
    left: windowWidth * (50/750),
    bottom: windowHeight * (18/1334),
  },
  backButton: {
    height: windowHeight * (41/1334),
    width: windowHeight * (41/1334),
  },
  detailView: {
    height: windowHeight * (560/1334),
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  actionView: {
    height: windowHeight * (150/1334),
    width: windowWidth,
    backgroundColor: '#8e2729',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionButton: {
    height: windowHeight * (150/1334),
    width: (windowWidth - 1) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSeparator: {
    height: windowHeight * (100/1334),
    width: 1,
    backgroundColor: 'white',
  }
});
