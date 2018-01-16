import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text,
  ScrollView,
  AlertIOS
} from 'react-native';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {Col, Row, Grid} from 'react-native-easy-grid';
import { Icon } from 'react-native-elements'


import * as ENDPOINTS from "../../endpoints";
import { requestJoinGroup } from '../../actions/classmateActions';


const mapStateToProps = (state) => ({
  user: state.userReducer.userData,
});
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class GroupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
    }
  }

  componentDidMount() {
    this.fetchMembers();
  }

  fetchMembers = () => {
    const { groupObj } = this.props;
    console.log(groupObj);
    fetch(`${ENDPOINTS.BASE}${ENDPOINTS.GET_MEMBERS}?groupid=${groupObj.groupId}&pageSize=10`)
      .then(res => res.text())
      .then(
        text => {
          const json = JSON.parse(text);
          if (json.success) {
            let actualPayload = json.datas;
            console.log("FETCH members Success");
            console.log(json);
            if (actualPayload === null) {actualPayload = [];}
            this.setState({
              members: actualPayload
            });
          } else {
            console.log("FETCH members Failed");
         }
        },
        err => {
          console.log(err);
        }
      )
  }

  _renderListSeparator = () => {
    return (
      <View style={styles.listSeparator} />
    );
  };

  _renderMember = () => {
    const { members } = this.state;
    const { groupId } = this.props.groupObj
    return (
      <View style={styles.membersView}>
        <Grid>
          <Col size={7}>
            <Row alignItems='center'>
              {
                members.map((member, index) => {
                  return (
                    <View
                      key={index}
                      style={styles.avatarView}>
                      <Image
                        source={{uri: member.avatar}}
                        style={styles.avatar}
                      />
                    </View>
                  )
                })
              }
            </Row>
          </Col>
          <Col size={1}>
            <Row alignItems='center'>
              <Text
                style={{fontSize: 12, marginRight: 5}}
                >
                全部
                </Text>
                <TouchableOpacity onPress={() => Actions.memberList({groupId})}>
                  <Icon
                    name='ios-arrow-forward'
                    type='ionicon'
                    color='#c03431'
                    size={25}
                  />
                </TouchableOpacity>
            </Row>
          </Col>
        </Grid>
      </View>
    )
  }


  render() {
    const { groupObj, user } = this.props;
    console.log(groupObj)
    return (
      <ScrollView
        style={{flex:1, backgroundColor:'white'}}
        contentContainerStyle={{alignItems: 'center'}}
        >
        <View style={styles.topBar}>
          <View style={{backgroundColor: 'transparent', zIndex:2}}>
            <Text style={styles.headerText}>
              小组
            </Text>
          </View>
          <View style={styles.topBarInfoView}>
            <Grid>
              <Row backgroundColor='transparent'>
                <Col alignItems='center' backgroundColor='transparent'>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode='tail'
                    style={styles.groupNameText}>
                    {groupObj.groupName}
                  </Text>
                </Col>
              </Row>

              <Row backgroundColor='transparent'>
                <Col alignItems='center' backgroundColor='transparent'>
                  <Text style={styles.rating}>
                    学霸指数: ★★★★★
                  </Text>
                </Col>
              </Row>
            </Grid>
          </View>
          <Image
            source={require('../../img/groupBackground.png')}
            style={styles.topBarImage}
            />
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => Actions.pop()}
          >
            <Image
              style={styles.backButton}
              source={require('../../img/leftArrow-white.png')}
              />
          </TouchableOpacity>
        </View>

        <View style={styles.titleView}>
          <Text style={styles.titleFont}> 小组资料 </Text>
        </View>
        <View alignItems='center'>
          <View style={styles.infoItemView}>
            <Grid>
              <Col size={2}>
                <Text style={{fontSize: 14}}>
                  创建人
                </Text>
              </Col>
              <Col size={5} alignItems='flex-end'>
                <Text style={{fontSize: 14}}>
                  {groupObj.creatorName}
                </Text>
              </Col>
            </Grid>
          </View>
          {this._renderListSeparator()}
          <View style={styles.infoItemView}>
            <Grid>
            <Col size={2}>
              <Text style={{fontSize: 14}}>
                涉及科目
              </Text>
            </Col>
            <Col size={5} alignItems='flex-end'>
              <Text style={{fontSize: 14}}>
                {groupObj.groupTag}
              </Text>
            </Col>
            </Grid>
          </View>
          {this._renderListSeparator()}
          <View style={styles.infoItemView}>
            <Grid>
            <Col size={2}>
              <Text style={{fontSize: 14}}>
                简介
              </Text>
            </Col>
            <Col size={5} alignItems='flex-end'>
              <Text style={{fontSize: 14}}>
                {groupObj.groupIntro}
              </Text>
            </Col>
            </Grid>
          </View>
          {this._renderListSeparator()}
          <View style={{height: 30, width: 1}} />
          <TouchableOpacity
            onPress={() => {
              AlertIOS.prompt(
                '入群请求',
                '请输入你的入群请求信息',
                [
                  {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: '发送', onPress: message => requestJoinGroup(user.uid, groupObj.groupId, 'Hello' ,user.token)},
                ],
                'plain-text'
              );
            }}
            style={styles.button}>
            <Text style={styles.buttonText}>申请加入</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>开始群聊</Text>
          </TouchableOpacity>

          { user.uid == groupObj.creatorId && <TouchableOpacity onPress={() => {Actions.inviteGroup({groupId: groupObj.groupId})}} style={styles.button}>
            <Text style={styles.buttonText}>邀请加入</Text>
          </TouchableOpacity>}

        </View>

        <View style={styles.titleView}>
          <Text style={styles.titleFont}> 小组成员 </Text>
        </View>

        {this._renderMember()}
        <View style={styles.listSeparator} />

      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  avatarView: {
    height: windowHeight * (100/1334),
    width: windowHeight * (100/1334),
    borderRadius: windowHeight * (50/1334),
    marginRight: 10,
    overflow: 'hidden',
  },
  avatar: {
    height: windowHeight * (100/1334),
    width: windowHeight * (100/1334),
  },
  button: {
    borderRadius: 5,
    width: windowWidth * (65/75),
    height: windowHeight * (60/1334),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c03431',
    marginBottom: windowHeight * (20/1334),
    marginTop: windowHeight * (20/1334),
  },
  buttonText: {
    fontSize: 14,
    color: 'white'
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    top: windowHeight * (60/1334),
  },
  groupNameText: {
    color: 'white',
    fontSize: 18,
  },
  rating: {
    color: 'white',
    fontSize: 16,
  },
  titleView: {
    height: windowHeight * (80/1334),
    width: windowWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8ebeb'
  },
  titleFont: {
    fontSize: 16,
    color: '#c03431'
  },
  topBarImage: {
    height: windowHeight * (400/1334),
    width: windowWidth,
    position: 'absolute',
    zIndex: 1,
  },
  topBar: {
    height: windowHeight * (400/1334),
    width: windowWidth,
    marginBottom: windowHeight * (40/1334),
    zIndex: 2,
    alignItems: 'center',
  },
  topBarInfoView: {
    height: windowHeight * (250/1334),
    width: windowWidth,
    zIndex: 2,
    top: windowHeight * (150/1334),
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
  listSeparator: {
    height: 1,
    width: windowWidth * (650/750),
    backgroundColor: "#c03431",
  },
  infoItemView: {
    width: windowWidth * (650/750),
    paddingTop: windowHeight * (30/1334),
    paddingBottom: windowHeight * (30/1334),
  },
  membersView: {
    marginTop: windowHeight * (20/1334),
    width: windowWidth * (650/750),
    height: windowHeight * (140/1334),
  }
})

export default connect(mapStateToProps)(GroupPage);
