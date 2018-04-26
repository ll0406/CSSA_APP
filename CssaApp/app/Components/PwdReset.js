import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  FlatList,
  Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Jiro } from 'react-native-textinput-effects';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import {
  pwdChange
} from '../actions/userActions'

export default class PwdReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPwd: '',
      newPwd: '',
      repeat: '',
    }
  }
  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item}) => {
    const { user } = this.props;
    const { onChange, label } = item;
    return (
      <View
        style={styles.listItem}
        >
        <Jiro
          label={label}
          // this is used as active and passive border color
          borderColor={'#c03431'}
          labelStyle={{
            color: '#c03431',
            fontSize: 16,
          }}
          inputStyle={{ color: 'white' }}
          autoCapitalize={'none'}
          secureTextEntry
          onChangeText={(text) => {
           onChange(text)
          }}
        />
      </View>
    )
  }
  render() {
    let listData = [
      {
        label: '旧密码',
        onChange: (text) => {
          this.setState({oldPwd: text})
        }
      },
      {
        label: '新密码',
        onChange: (text) => {
          this.setState({newPwd: text})
        }
      },
      {
        label: '重复新密码',
        onChange: (text) => {
          this.setState({repeat: text})
        }
      }
    ]

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => Actions.pop()}
          >
            <Image
              style={styles.backButton}
              source={require('../img/leftArrow-red.png')}
              />
          </TouchableOpacity>
          <Text
            style={styles.headerText}
            >
              修改密码
          </Text>

          <TouchableOpacity
            style={styles.topRightTextContainer}
            onPress={() => {
              const { oldPwd, newPwd, repeat } = this.state;
              const { uid, token } = this.props;

              if (newPwd === repeat && newPwd !== "") {
                pwdChange(uid, oldPwd, newPwd, token);
              } else {
                Alert.alert('更改密码失败','两次新密码输入不同')
              }
            }}
          >
            <Text
              style={{fontSize: 18, fontWeight: 'bold', color:'#513d3d'}}>
              提交
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listView}>
          <FlatList
            data={listData}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            showsVerticalScrollIndicator={false}
            />
        </View>
      </View>
    )
  }


}

const styles = StyleSheet.create({
  topBar: {
    height: windowHeight * (124/1334),
    backgroundColor: '#ededed',
    alignItems: 'center',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowColor: 'black',
    shadowOffset: { height: 2, width: 2 },
    zIndex: 2,
  },
  headerText: {
    color: '#c03431',
    fontWeight: 'bold',
    fontSize: 18,
    position: 'absolute',
    bottom: windowHeight * (30/1334),
  },
  listView: {
    backgroundColor: 'white',
    position: 'absolute',
    top: windowHeight * (174/1334),
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    height: windowHeight * (1060/1334),
    zIndex: 1,
  },
  listItem: {
    height: windowHeight * (180/1334),
    width: windowWidth * (65/75),
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    width: windowWidth * (65/75),
    backgroundColor: "#c03431",
  },
  bodyFont: {
    fontSize: 16,
    fontWeight: 'bold',
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
  topRightTextContainer: {
    position: 'absolute',
    right: windowWidth * (50/750),
    bottom: windowHeight * (30/1334),
  },
});
