import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import StatusBarAlert from 'react-native-statusbar-alert';
import {INVALIDATE_USER, DISMISS_ALERT} from '../constants';

import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';

import {Col, Row, Grid} from 'react-native-easy-grid';


import { Circle } from 'react-native-svg';
import Svg from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';


import Footer from './Footer';

import {
  invalidateUser,
  avatarUpdate
} from '../actions/userActions'


const mapStateToProps = (state) => ({
  profileKeys: state.reducer.profileKeys,
  defaultName: state.reducer.name,
  defaultBirthday: state.reducer.bd,
  photoUri: state.reducer.photoUri,
  user: state.userReducer.userData,
  changeDetected: state.userReducer.changeDetected,
  isConnected: state.networkReducer.isConnected,
})

class AccountPage extends Component {
  constructor(props) {
      super(props);
      const {defaultBirthday, user} = this.props
  }

  handleLogout = () => {
    const {dispatch} = this.props;
    dispatch({
      type: INVALIDATE_USER,
    });
    Actions.login();
  }


  renderSeparator = () => {
    return (
      <View style={styles.separator}></View>
    )
  }

  renderListItem = (listText, hasArrow, onPressFunc) => {
    return (
      <View style={styles.listItem}>
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => onPressFunc()}
        >
          <Grid>
            <Col size={8} style={{justifyContent: 'center'}}>
                <Text>{listText}</Text>
            </Col>
            <Col size={1} style={{justifyContent: 'center'}}>
                {
                  hasArrow &&
                  <Icon name="angle-right" size={30} color="#900" />
                }
              </Col>
            </Grid>
        </TouchableOpacity>
        <View style={styles.listSeparator}></View>
      </View>
    )
  }

  render() {
    const { profileKeys, defaultBirthday, defaultName, photoUri, user, changeDetected, updating, dispatch } = this.props;
    const defaultPhoto = 'https://image.ibb.co/m8tG7v/123.jpg';
    const picUri = user ?
      `http://www.bucssa.net/uc_server/data/avatar/000/00/00/${user.uid}_avatar_big.jpg?random_number=${new Date().getTime()}`
       :
       defaultPhoto;
    const displayName = user ? user.nickname : defaultName;

    const genderIndex = user ? `${user.gender}` : profileKeys[0];
    let gender;
    if (genderIndex == 1) {
      gender = '♂';
    } else if (genderIndex == 2) {
      gender = '♀';
    } else {
      gender = '';
    }


    return (
      <View style={styles.pageView}>
        <StatusBarAlert
            visible={!this.props.isConnected}
            message="网络异常... 请检查网络"
            backgroundColor="firebrick"
            color="white"
            style={styles.alert}
        />
        <View style={styles.topView}>
          <Svg
             height={Dimensions.get('window').height * (220/1334)}
             width={Dimensions.get('window').height * (220/1334)}
             style={styles.profileSvg}
            >
            <Circle
                    cx={Dimensions.get('window').height * (110/1334)}
                    cy={Dimensions.get('window').height * (110/1334)}
                    r={Dimensions.get('window').height * (100/1334)}
                    stroke="white"
                    strokeWidth={Dimensions.get('window').height * (20/1334)}
                    strokeOpacity={0.3}
                    fill="white"
                    fillOpacity={0.5}
                />
          </Svg>

          <View
            style={styles.imageContainer}>
            <Image
              style={styles.profileImg}
              source={{uri: picUri}}
            />
          </View>

          <View
              style={styles.gradient}
            >

            <View style={styles.profileNameView}>
              <Grid>
                <Col size={4} style={{justifyContent: 'center'}}>
                  <Text
                  style={styles.profileName}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  >
                  {displayName}
                  </Text>
                </Col>
                <Col size={1} style={{justifyContent: 'center', alignItems: 'flex-end'}}>
                  <Text style={{fontSize: 12, color:'white', fontWeight: 'bold'}}>
                    {gender}
                  </Text>
                </Col>
              </Grid>
            </View>

            <TouchableOpacity
              style={styles.modifyButton}
              onPress={() => Actions.editInfo()}
              >
              <Image
                style={styles.modifyButton}
                source={require('../img/modifyButton.png')}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.introView}>
            <Text
              style={styles.introText}
              numberOfLines={5}
              ellipsizeMode='tail'
            >
              { (user !== undefined) && (user.bio === '') ? '这个新来的宝宝什么也没留下 Σ(ﾟωﾟ)' : user.bio}
            </Text>
          </View>
          <View style={styles.separator}></View>
        </View>

        <View style={styles.listView}>
          {this.renderListItem('我的好友', true, () => Actions.friendsPage() )}
          {this.renderListItem('我的收藏', true, () => Actions.collectionPage() )}
          {this.renderListItem('设置', true, () => Actions.settings() )}
          {this.renderListItem('退出登录', false, () => {
            Actions.login();
            dispatch(invalidateUser());
            })}
        </View>

        <Footer
          current={Actions.currentScene}
          />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  pageView: {
    flex: 1,
    backgroundColor: 'white',
  },
  topView: {
    height: Dimensions.get('window').height * (495/1334),
  },
  gradient: {
    height: Dimensions.get('window').height * (265/1334),
    zIndex: 1,
    backgroundColor: '#c03431'
  },
  modifyButton: {
    height: Dimensions.get('window').width * (144/750) * (32/144),
    width: Dimensions.get('window').width * (144/750),
    position: 'absolute',
    right: Dimensions.get('window').width * (30/750),
    bottom: Dimensions.get('window').height * (17/1334),
  },
  profileSvg: {
    position: 'absolute',
    left: Dimensions.get('window').width * (50/750),
    top: Dimensions.get('window').height * (150/1334),
    zIndex: 2,
  },
  imageContainer: {
    height: Dimensions.get('window').height * (180/1334),
    width: Dimensions.get('window').height * (180/1334),
    borderRadius: Dimensions.get('window').height * (90/1334),
    position: 'absolute',
    top: Dimensions.get('window').height * (170/1334),
    left: Dimensions.get('window').width * (70/750),
    overflow: 'hidden',
    zIndex: 3,
    backgroundColor: 'white'
  },
  profileImg: {
    height: Dimensions.get('window').height * (180/1334),
    width: Dimensions.get('window').height * (180/1334),
  },
  profileNameView: {
    height: Dimensions.get('window').height * (40/1334),
    width: Dimensions.get('window').width * (220/750),
    position: 'absolute',
    bottom: Dimensions.get('window').height * (32/1334),
    left: Dimensions.get('window').width * (330/750),
    backgroundColor: 'transparent',
  },
  profileName: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  introView: {
    position: 'absolute',
    height: Dimensions.get('window').height * (140/1334),
    width: Dimensions.get('window').width * (420/750),
    right: Dimensions.get('window').width * (30/750),
    top: Dimensions.get('window').height * (290/1334),
  },
  introText: {
    fontSize: 12,
  },
  separator: {
    height: 1,
    width: Dimensions.get('window').width * (650/750),
    backgroundColor: '#c03431',
    position: 'absolute',
    bottom: 1,
    right: Dimensions.get('window').width * (50/750)
  },
  listView: {
    alignItems: 'center',
  },
  listItem: {
    height: Dimensions.get('window').height * (80/1334),
    width: Dimensions.get('window').width * (650/750),
  },
  listSeparator: {
    height: 1,
    width: Dimensions.get('window').width * (650/750),
    backgroundColor: '#c03431',
    position: 'absolute',
    bottom: 1,
  }
})

export default connect(mapStateToProps)(AccountPage)
