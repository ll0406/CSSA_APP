import React, { Component } from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Dimensions,
  FlatList,
  Alert,
  ActionSheetIOS
 } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {Col, Row, Grid} from 'react-native-easy-grid';
import Swipeout from 'react-native-swipeout';
import Swiper from 'react-native-swiper';
import { Badge } from 'react-native-elements';

import Footer from './Footer';
import { CLEAR_MESSAGES } from '../constants';
import { fetchMessageList, requestDeleteMessage, setRead } from '../actions/messageActions';

const mapStateToProps = (state) => ({
  user: state.userReducer.userData,
  messageList: state.messageReducer.messageList,
  sysMessage: state.messageReducer.sysMessage,
  isFetchingList: state.messageReducer.isFetchingList,
})

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class Inbox extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { user, dispatch } = this.props;
    dispatch({type: CLEAR_MESSAGES});
    if(user !== undefined) {
      dispatch(fetchMessageList(user.uid, user.token));
    }
  }

  handleMessagePress(plid, pmType, pmSubject, pmNum, toUsername){
    Actions.messagePage({plid, pmType, pmSubject, pmNum, toUsername});
  }

  showActionSheet = (uid, plid, pmType, token) => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        '删除',
        '取消',
      ],
      cancelButtonIndex: 1,
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        const { dispatch } = this.props;
        dispatch(requestDeleteMessage(uid, [plid], [pmType], token));
      }
    });
  }

  _renderItem = ({item}) => {
    const { user } = this.props;
    return (
          <TouchableOpacity
            style={styles.message}
            onPress={() => this.handleMessagePress(item.plid, item.pmType, item.subject, item.pmNum, item.toUsername)}
            onLongPress={() => this.showActionSheet(user.uid, item.plid, item.pmType, user.token)}
            >
            <Grid>
              <Col size={14} style={{justifyContent: 'center'}}>
              {
                item.hasNew > 0 &&
                  <View
                    style={{
                      backgroundColor: '#c03431',
                      position: 'absolute',
                      zIndex: 3,
                      top: windowHeight * (20/1334),
                      left:  windowHeight * (70/1334),
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                    }}
                    />
              }
                <View style={styles.msgImageContainer}>
                  {
                    item.pmType === 2 ?
                    <Image
                      source={{uri: 'https://cdn3.iconfinder.com/data/icons/pix-glyph-set/50/520643-group-512.png'}}
                      style={styles.msgImage}
                      />
                    :
                    <Image
                    source={{uri: item.avatar}}
                    style={styles.msgImage}
                    />

                  }
                </View>
              </Col>
              <Col size={51} style={{justifyContent: 'center'}}>
                <Text
                  style={styles.msgTitleFont}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >
                  {
                    item.pmType === 1 ?
                      `${item.toUsername}`
                      :
                      `群聊: ${item.subject}`
                  }
                </Text>
                <Text
                  style={styles.bodyFont}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >
                  {item.summary}
                </Text>
              </Col>
            </Grid>
          </TouchableOpacity>
    )
  }

  _renderSystemMessages= ({item}) => {
    const { user } = this.props;
    return (
          <TouchableOpacity
            style={styles.message}
            onPress={() => Actions.confirmation({confirmMessage: item})}
            >
            <Grid>
              <Col size={14} style={{justifyContent: 'center'}}>
              {
                item.is_new > 0 &&
                  <View
                    style={{
                      backgroundColor: '#c03431',
                      position: 'absolute',
                      zIndex: 3,
                      top: windowHeight * (20/1334),
                      left:  windowHeight * (70/1334),
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                    }}
                    />
              }
                <View style={styles.msgImageContainer}>
                  {
                    item.category == 2 ?
                    <Image
                      source={{uri: `http://www.bucssa.net/uc_server/data/avatar/000/00/00/${item.authorid}_avatar_middle.jpg?random_number=${new Date().getTime()}`}}
                      style={styles.msgImage}
                      />
                    :
                    <Image
                      source={{uri: `http://www.bucssa.net/uc_server/data/avatar/000/00/00/${item.authorid}_avatar_middle.jpg?random_number=${new Date().getTime()}`}}
                      style={styles.msgImage}
                    />

                  }
                </View>
              </Col>
              <Col size={51} style={{justifyContent: 'center'}}>
                {
                (item.category == 2 || item.category == 3) &&
                  <Text
                    style={styles.msgTitleFont}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    {
                      item.author
                    }
                  </Text>
                }
                <Text
                  style={styles.bodyFont}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >
                  {
                    item.content
                  }
                </Text>
              </Col>
            </Grid>
          </TouchableOpacity>
    )
  }

  _keyExtractor = (item, index) => index;

  _renderSeparator = () => {
    return (
      <View style={styles.separator} />
    );
  };

  _renderHeader= () => {
    return (
      <View style={{width: windowWidth * (61/75), height: 20}} />
    );
  }
  render() {
    const { user, messageList, sysMessage, isFetchingList, dispatch} = this.props;
    let uid, token;
    if (user !== undefined) {
      uid = user.uid;
      token = user.token
    }
      return(
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <Swiper
            width={windowWidth}
            height={windowHeight}
            loop={true}
            showsPagination={false}
          >
            <View>
              <View style={styles.topBar}>
                <TouchableOpacity
                  style={styles.addButtonContainer}
                  onPress={() => Actions.createMessage()}
                  >
                  <Image
                    source={require('../img/addMessage.png')}
                    style={styles.addButton}
                  />
                </TouchableOpacity>

                <Text
                  style={styles.headerText}
                  >
                    消息
                </Text>
              </View>

              <View style={styles.listView}>
                <FlatList
                  data={messageList}
                  renderItem={this._renderItem}
                  keyExtractor={this._keyExtractor}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={this._renderSeparator}
                  ListFooterComponent={this._renderSeparator}
                  ListHeaderComponent={this._renderHeader}
                  />
              </View>

              <View style={styles.backgroundImageView}>
                <Image
                  style={styles.backgroundImage}
                  source={require('../img/iconBackground.png')}
                />
              </View>

            </View>

            <View>
              <View style={styles.topBar}>
                <Text
                  style={styles.headerText}
                  >
                    系统消息
                </Text>
              </View>
              <View style={styles.listView}>
                <FlatList
                  data={sysMessage}
                  renderItem={this._renderSystemMessages}
                  keyExtractor={this._keyExtractor}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={this._renderSeparator}
                  ListFooterComponent={this._renderSeparator}
                  ListHeaderComponent={this._renderHeader}
                  />
              </View>
            </View>

          </Swiper>


          <Footer
            current={Actions.currentScene}
          />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  backgroundImageView: {
    height: windowHeight,
    width: windowWidth,
    overflow: 'hidden',
    zIndex: 1,
    position: 'absolute',
  },
  backgroundImage: {
    position: 'absolute',
    height: windowWidth * (447/750),
    width: windowWidth * (447/750),
    bottom: windowHeight * (12/1334),
    left: windowWidth * (-65/750),
  },
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
    backgroundColor: 'transparent',
    position: 'absolute',
    top: windowHeight * (124/1334),
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    height: windowHeight * (1099/1334),
    zIndex: 3,
  },
  message: {
    height: windowHeight * (120/1334),
    width: windowWidth * (65/75),
  },
  separator: {
    height: 1,
    width: windowWidth * (65/75),
    backgroundColor: "#c03431",
  },
  msgTitleFont: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  bodyFont: {
    fontSize: 14,
  },
  msgImageContainer: {
    height: windowHeight * (90/1334),
    width: windowHeight * (90/1334),
    borderRadius: windowHeight * (45/1334),
    overflow: 'hidden',
  },
  msgImage: {
    height: windowHeight * (90/1334),
    width: windowHeight * (90/1334),
    position: 'absolute',
    zIndex: 2,
  },
  badge: {
    position: 'absolute',
    zIndex: 3,
    top: windowHeight * (10/1334),
    left:  windowHeight * (60/1334),
  },
  addButtonContainer: {
    position: 'absolute',
    right: windowWidth * (50/750),
    bottom: windowHeight * (25/1334),
  },
  addButton: {
    height: windowHeight * (50/1334),
    width: windowHeight * (50/1334),
  }

});


export default connect(mapStateToProps)(Inbox)
