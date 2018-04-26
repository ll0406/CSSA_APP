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
  TextInput,
  KeyboardAvoidingView,
  ActionSheetIOS,
  Alert
} from 'react-native';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {Col, Row, Grid} from 'react-native-easy-grid';

import * as ENDPOINTS from "../../endpoints";
import { makeComment, delComment } from '../../actions/classmateActions';

const mapStateToProps = (state) => ({
  user: state.userReducer.userData,
});
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class PostPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      placeholder: '请输入...',
      atWho: '0',
      comments: []
    }
  }

  componentDidMount() {
    this.fetchComments();
  }

  fetchComments = () => {
    fetch(`${ENDPOINTS.BASE}${ENDPOINTS.GET_COMMENT}?postId=${this.props.postObj.postId}&pageSize=1000`)
      .then(res => res.text())
      .then(
        text => {
          const json = JSON.parse(text);
          if (json.success) {
            console.log("FETCH Comments Success");
            let actualPayload = json.datas;
            console.log(actualPayload);
            if (actualPayload === null) {actualPayload = [];}
            this.setState({
              comments: actualPayload
            });
          } else {
            console.log("FETCH Comments Failed");
         }
        },
        err => {
          console.log(err);
        }
      ).catch(err => Alert.alert('网络出错'))
  }

  renderTopCard = () => {
    const { postObj, user } = this.props;
    return (
      <View
        style={styles.postItemView}>
        <Grid>
          <Col size={1.2}>
            <TouchableOpacity
              style={styles.avatarView}
              onPress={() => {
                  if (postObj.authorId != user.uid){
                    Actions.personPage({requestUid:postObj.authorId})
                  }
                }}
              >
              <Image
                style={styles.avatar}
                source={{uri: `http://bucssa.net/uc_server/avatar.php?uid=${postObj.authorId}&size=middle`}}
                />
            </TouchableOpacity>
          </Col>
          <Col size={6.3}>
            <Row size={1.5} marginBottom={5}>
              <Col size={4} justifyContent='center'>
                <Text
                  style={{fontSize: 12}}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  >
                  {postObj.authorName}
                </Text>
              </Col>
              <Col size={3} justifyContent='center' alignItems='flex-end'>
                <Text
                  style={{fontSize: 8, color: 'gray'}}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  >
                  {new Date(eval(postObj.dateline)*1000).toLocaleString()}
                </Text>
              </Col>
            </Row>
            <Row size={4}>
              <Col justifyContent='center'>
                <Text
                  style={styles.listItemFontBold}
                  >
                  {postObj.subject}
                </Text>
                <Text
                  style={styles.listItemFont}
                  >
                  {postObj.content}
                </Text>
              </Col>
            </Row>
          </Col>

        </Grid>
      </View>
    )
  }

  showActionSheet = (uid, postid, commentid, token) => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        '删除',
        '取消',
      ],
      cancelButtonIndex: 1,
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        delComment(uid, postid, commentid, token)
        setTimeout(() => {
          this.fetchComments();
        }, 100)
      }
    });
  }

  _renderItem = ({item}) => {
    let headText;
    if (item.toUsername !== undefined) {
      headText = `${item.fromUsername} @ ${item.toUsername}`
    } else {
      headText = item.fromUsername
    }

    return (
      <View
        style={styles.postItemView}>
        <Grid>
          <Col size={1.2}>
            <TouchableOpacity style={styles.avatarView}
              onPress={() => {
                if (item.fromUid != this.props.user.uid){
                  Actions.personPage({requestUid:item.fromUid})
                }
              }}
              >
              <Image
                style={styles.avatar}
                source={{uri: `http://bucssa.net/uc_server/avatar.php?uid=${item.fromUid}&size=middle`}}
                />
            </TouchableOpacity>
          </Col>
          <Col size={6.3}>
            <TouchableOpacity
              onPress={() => {
                if (item.fromUid != this.props.user.uid){
                  this.setState({placeholder: `@ ${item.fromUsername}: `, atWho: item.fromUid}, this.refs.TextInput.focus())
                } else {
                  this.showActionSheet(this.props.user.uid, item.postId, item.commentId, this.props.user.token)
                }
              }}
              >
              <Row size={1.5} marginBottom={5}>
                <Col size={4} justifyContent='center'>
                  <Text
                    style={{fontSize: 12}}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    >
                    {headText}
                  </Text>
                </Col>
                <Col size={3} justifyContent='center' alignItems='flex-end'>
                  <Text
                    style={{fontSize: 8, color: 'gray'}}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    >
                    {new Date(eval(item.dateline)*1000).toLocaleString()}
                  </Text>
                </Col>
              </Row>
              <Row size={4}>
                <Col justifyContent='center'>
                  <Text
                    style={styles.listItemFont}
                    >
                    {item.content}
                  </Text>
                </Col>
              </Row>
            </TouchableOpacity>
          </Col>

        </Grid>
      </View>
    )
  }

  _keyExtractor = (item, index) => index.toString();

  _renderListSeparator = () => {
    return (
      <View style={styles.listSeparator} />
    );
  };

  render() {
    const { user, postObj } = this.props
    return (
      <View
        style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              setTimeout(()=> {Actions.refresh({})}, 50);
              Actions.pop();
            }}
          >
            <Image
              style={styles.backButton}
              source={require('../../img/leftArrow-red.png')}
              />
          </TouchableOpacity>

          <Text
            style={styles.headerText}
            >
              话题
          </Text>
          <View style={styles.separator} />
        </View>

        <View style={styles.scrollView}>
          <ScrollView
            contentContainerStyle={{
              alignItems: 'center',
            }}
            >
              {this.renderTopCard()}
              <View style={styles.listView}>
                <FlatList
                  data={this.state.comments}
                  renderItem={this._renderItem}
                  ItemSeparatorComponent={this._renderListSeparator}
                  keyExtractor={this._keyExtractor}
                  showsVerticalScrollIndicator={false}
                  />

              </View>

          </ScrollView>
        </View>
        <KeyboardAvoidingView
          behavior={'position'}
          >
          <View style={styles.inputView}>
            <Grid>
              <Col size={60}>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => this.setState({text})}
                  placeholder={this.state.placeholder}
                  placeholderTextColor={'gray'}
                  ref="TextInput"
                  numberOfLines={1}
                  value={this.state.text}
                  onBlur={() => {
                    this.setState({atWho: '0', placeholder: '请输入...', text: ''})
                  }}
                  />
              </Col>
              <Col size={15} alignItems={'center'} justifyContent={'center'}>
                {
                  (this.state.text !== '') &&
                  <TouchableOpacity
                    onPress={() => {
                      this.refs.TextInput.blur();
                      makeComment(user.uid, postObj.postId, this.state.atWho, this.state.text, user.token);
                      setTimeout(() => {
                        this.fetchComments();
                      }, 100)
                    }}
                    >
                    <Image source={require('../../img/send.png')} resizeMode={'center'}/>
                  </TouchableOpacity>
                }
              </Col>
            </Grid>
          </View>
        </KeyboardAvoidingView>
      </View>
    )

  }


}


const styles = StyleSheet.create({
  input: {
    marginLeft: 5,
    height: windowHeight * (90/1334),
    width: '100%',
  },
  inputView: {
    height: windowHeight * (90/1334),
    width: windowWidth,
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  scrollView: {
    width: windowWidth,
    alignItems: 'center',
    height: windowHeight * (1120/1334),
  },
  listItemFont: {
    fontSize: 14,
    marginBottom: 5,
  },
  listItemFontBold: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 10,
  },
  avatarView: {
    height: windowHeight * (80/1334),
    width: windowHeight * (80/1334),
    borderRadius: windowHeight * (40/1334),
    overflow: 'hidden',
  },
  avatar: {
    height: windowHeight * (80/1334),
    width: windowHeight * (80/1334),
  },
  centerView: {
    width: windowWidth,
    alignItems: 'center'
  },
  topBar: {
    height: windowHeight * (124/1334),
    backgroundColor: 'white',
    alignItems: 'center',
  },
  headerText: {
    color: '#c03431',
    fontWeight: 'bold',
    fontSize: 18,
    position: 'absolute',
    bottom: windowHeight * (30/1334),
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
  separator: {
    height: 1,
    width: windowWidth * (65/75),
    backgroundColor: "#c03431",
    position: 'absolute',
    bottom: 0,
  },
  listSeparator: {
    height: 1,
    width: windowWidth * (610/750),
    backgroundColor: "#c03431",
  },
  postItemView: {
    width: windowWidth * (610/750),
    marginBottom: 10,
    marginTop: 10
  },
  listView: {
    marginTop: 20,
    width: windowWidth * (65/75),
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#c03431',
    borderWidth: 2,
  }
});

export default connect(mapStateToProps)(PostPage);
