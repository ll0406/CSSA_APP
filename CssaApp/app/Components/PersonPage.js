import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  Alert
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';

import {Col, Row, Grid} from 'react-native-easy-grid';

import * as ENDPOINTS from "../endpoints";
import {
  createMessage,
} from '../actions/messageActions';

const mapStateToProps = (state) => ({
  user: state.userReducer.userData,
})

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


class PersonPage extends Component {
  constructor(props) {
      super(props);
      this.state= {
        loaded: false
      }
  }

  componentDidMount() {
    this.requestInfo();
  }

  requestInfo = () => {
    const { user, requestUid } = this.props;
    console.log("FETFCH INFO For ID: ", requestUid);
    fetch(`${ENDPOINTS.BASE}${ENDPOINTS.GET_PERSON_INFO}?uid=${requestUid}&requestUid=${user.uid}&token=${user.token}`)
      .then(res => res.text())
      .then(
        text => {
          const json = JSON.parse(text);
          if (json.success) {
            console.log(json);
            this.setState({
              person: json.datas,
              loaded: true,
            });
          } else {
            console.log("FETCH Failed");
            Alert.alert('获取用户信息失败',json.error)
         }
        },
        err => {
          console.log(err);
          Alert.alert('获取用户信息失败',err)
        }
      )
  }

  renderSeparator = () => {
    return (
      <View style={styles.separator} />
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
    const { user } = this.props;
    const { person, loaded } = this.state

    const genderIndex = person ? `${person.gender}` : '3';
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
        <View style={styles.topView}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => Actions.pop()}
          >
            <Image
              style={styles.backButton}
              source={require('../img/leftArrow-white.png')}
              />
          </TouchableOpacity>
          {this.state.loaded &&
            <View
            style={styles.imageContainer}>
              <Image
                style={styles.profileImg}
                source={{uri:`http://www.bucssa.net/uc_server/data/avatar/000/00/00/${person.uid < 10 ? '0' + person.uid : person.uid}_avatar_big.jpg?random_number=${new Date().getTime()}`}}
                />
            </View>
          }
          <View
              style={styles.gradient}/>
        </View>

        {
          loaded &&
            <View style={styles.infoView}>
              <View style={styles.idClassBioView}>
                <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>{person.nickname}  {person.gender === 1 ? '♂' : person.gender === 2 ? '♀' : '' }</Text>
                <Text style={{fontSize: 16, marginBottom: 5}}>{person.college}</Text>
                <Text style={{fontSize: 16, marginBottom: 20}}>{person.major}</Text>
                {this.renderSeparator()}
                <Text
                  style={{fontSize: 16, marginTop: 20, marginBottom: 20}}
                  numberOfLines={5}
                  ellipsizeMode='tail'
                  >
                  { person && (person.bio === '') ? '这个新来的宝宝什么也没留下 Σ(ﾟωﾟ)' : person.bio}
                </Text>
              {
                (person.uid != user.uid) &&
                  <View>
                    <View
                      style={styles.pairView}
                      >
                      <Grid>
                        <Col size={1} justifyContent={'center'}>
                          <Text style={{fontSize: 16}}>
                            生日
                          </Text>
                        </Col>
                        <Col size={3} justifyContent={'center'}>
                          <Text
                            style={{fontSize: 16}}
                            >
                            {(person.dateOfBirth === '' || person.dateOfBirth === undefined) ? '未公开' : person.dateOfBirth}
                          </Text>
                        </Col>
                      </Grid>
                    </View>
                    <View
                      style={styles.pairView}
                      >
                      <Grid>
                        <Col size={1} justifyContent={'center'}>
                          <Text style={{fontSize: 16}}>
                            感情状况
                          </Text>
                        </Col>
                        <Col size={3} justifyContent={'center'}>
                          <Text
                            style={{fontSize: 16}}
                            >
                            {(person.affectivestatus === '' || person.affectivestatus === undefined) ? '未公开' : person.affectivestatus}
                          </Text>
                        </Col>
                      </Grid>
                    </View>
                  </View>
            }
              </View>

              <View style={styles.buttonsView}>
                <TouchableOpacity style={styles.clickButtonContainer}>
                  <Text style={{fontSize: 14, color:'white', fontWeight:'bold'}}> 发送消息 </Text>
                </TouchableOpacity>
              {
              person.isFriend &&
                <TouchableOpacity style={styles.clickButtonContainer}>
                  <Text style={{fontSize: 14, color:'white', fontWeight:'bold'}}> 删除好友 </Text>
                </TouchableOpacity>
              }
              {
              (!person.isFriend && person.uid != user.uid) &&
                <TouchableOpacity style={styles.clickButtonContainer}>
                  <Text style={{fontSize: 14, color:'white', fontWeight:'bold'}}> 好友请求 </Text>
                </TouchableOpacity>
              }

              </View>




            </View>
        }
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
    height: Dimensions.get('window').height * (450/1334),
  },
  gradient: {
    height: Dimensions.get('window').height * (265/1334),
    zIndex: 1,
    backgroundColor: '#c03431'
  },
  imageContainer: {
    height: Dimensions.get('window').height * (180/1334),
    width: Dimensions.get('window').height * (180/1334),
    borderRadius: Dimensions.get('window').height * (90/1334),
    position: 'absolute',
    top: Dimensions.get('window').height * (170/1334),
    left: Dimensions.get('window').width * (70/750),
    borderWidth: 1,
    borderColor: '#c03431',
    overflow: 'hidden',
    zIndex: 3,
    backgroundColor: 'white'
  },
  profileImg: {
    height: Dimensions.get('window').height * (180/1334),
    width: Dimensions.get('window').height * (180/1334),
  },
  separator: {
    height: 1,
    width: Dimensions.get('window').width * (650/750),
    backgroundColor: '#c03431',
  },
  infoView: {
    alignItems: 'center',
  },
  idClassBioView: {
    width: Dimensions.get('window').width * (650/750),
    marginBottom: Dimensions.get('window').height * (100/1334),
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
  },
  buttonContainer: {
    height: windowHeight * (50/1334),
    width: windowWidth * (50/1334),
    position: 'absolute',
    left: windowWidth * (50/750),
    top: windowHeight * (60/1334),
    zIndex: 10,
  },
  backButton: {
    height: windowHeight * (41/1334),
    width: windowHeight * (41/1334),
  },
  buttonsView: {
    width: Dimensions.get('window').width * (65/75),
  },
  clickButtonContainer: {
    height: windowHeight * (60/1334),
    width: windowHeight * (150/1334),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
    marginBottom: 10,
    borderRadius: 5
  },
  pairView: {
    width: windowWidth * (650/750),
    height: windowHeight * (50/1334),
  },
})

export default connect(mapStateToProps)(PersonPage)
