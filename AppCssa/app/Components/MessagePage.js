import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Image,
  Text,
  TouchableOpacity
 } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux'
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';

//On Socket Implementation
import SocketIOClient from 'socket.io-client';

import { fetchMessage, fetchMessageList, requestMessageByOffset,
         replyMessage, setMessageRead} from '../actions/messageActions';
import { CLEAR_MESSAGES } from '../constants';

const mapStateToProps = (state) => ({
  user: state.userReducer.userData,
  initialMessages: state.messageReducer.initialMessages,
  oldMessages: state.messageReducer.oldMessages,
  isFetchingMessage: state.messageReducer.isFetchingMessage,
})

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class MessagePage extends Component {
  constructor(props) {
    super(props);

    //Deal with Socket
    this.socket = SocketIOClient('http://bucssa.net:3000');
    //On connect to server, join send a request to join a specific
    //room that will be used in chat.
    this.socket.on('connect', () => {
      this.socket.emit('room', `room-${props.plid}`);
    })
    this.socket.on('message', (message) => {
      this.onReceivedMessage(message)
    });

    this.state = {
      inputText: "",
      messages: [],
      contentOffset: 0,
      roomId: `room-${props.plid}`,
      incomingBuffer: [],
    }
  }

  //Socket needed functions
  onReceivedMessage = (message) => {
    this.storeMessage(message);
  }

  uuidv4 = () => {
     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
       let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
       return v.toString(16);
     });
    }

  storeMessage = (message) => {
    let messageObj = message;
    if (messageObj._id === undefined || messageObj._id === "") {
      messageObj._id = this.uuidv4();
    }
    if (messageObj.createdAt === undefined || messageObj.createdAt === "") {
      messageObj.createdAt = new Date();
    }
    if(this.state.contentOffset === 0) {
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, messageObj),
        };
      });
    } else {
      this.setState((previousState) => {
        return {
          incomingBuffer: [messageObj].concat(previousState.incomingBuffer),
        };
      });
    }
  }

  componentDidMount() {
    const { dispatch, plid, pmType, pmNum, user } = this.props;
    dispatch(fetchMessage(user.uid, plid, 5, pmType, 0, 30, user.token, 'new'));
  }

  componentWillUnmount() {
    this.socket.emit("leave room", this.state.roomId);
    this.socket.emit("close");
    const { user, dispatch, plid, pmType, pmNum } = this.props;

    dispatch(setMessageRead(user.uid, [plid], [pmType], user.token));
    dispatch(fetchMessageList(user.uid, user.token));
    this.setState({
      messages: [],
    });
    dispatch({type: CLEAR_MESSAGES});

  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, pmType, user, plid } = this.props;
    const { contentOffset, messages } = this.state;
    if (nextProps.initialMessages !== undefined) {
      this.setState({
        messages: nextProps.initialMessages,
      })
    }
    if (nextProps.oldMessages !== undefined) {
      this.setState((previousState) => {
        return {
          messages: GiftedChat.prepend(previousState.messages, nextProps.oldMessages),
          incomingBuffer: [],
        };
      });
    }
    dispatch({type: CLEAR_MESSAGES})
  }

  onSend = (newMessage) => {
    const { dispatch, user, plid } = this.props;
    //replyMessage Takes care of the database manipulation
    dispatch(
      replyMessage(user.uid, user.username, plid, newMessage[0].text, user.token)
    );

    //Emit message to the specific room
    //Need to include the room information in the message,
    //Then the server will redirect to specific room when unpacking
    newMessage[0].roomId = this.state.roomId;
    newMessage[0].user.avatar = user.avatar[2];
    this.socket.emit('message', JSON.stringify(newMessage[0]));
    this.storeMessage(newMessage);
  }

  onLoadEarlier = () => {
    const { dispatch, plid, pmType, user, currentPage } = this.props;
    //Load 20 messages before, using fetchByOffset
    const pmidOffset = this.state.messages.slice(-1)[0].pmid;
    dispatch(requestMessageByOffset(user.uid, plid, pmType, pmidOffset, 20, user.token));

  }

  _renderTime = (props) => {
    let time = props.currentMessage.createdAt;
    if (typeof(props.currentMessage.createdAt) == 'string') {
      time = new Date(props.currentMessage.createdAt)
    }
    return (
        <Text
          style={{
            fontSize: 8,
            color: 'gray',
            marginBottom: 5,
            paddingRight: 10,
            paddingLeft: 10,
          }}
        >
          {time.toLocaleTimeString()}
        </Text>
    );
  }

  renderBubble = (props) => {
    return (
      <Bubble
       {...props}
       textStyle={{
            left: {
              fontSize: 14,
              color: 'black'
            },
            right: {
    	         fontSize: 14,
               color: 'black'
    	       }
        }}
        wrapperStyle={{
            left: {
              backgroundColor: '#fdf1f0',
            },
            right: {
              backgroundColor: '#fdf1f0'
            }
        }} /> )
      }

  _renderSend = (props) => {
    return (
      <Send
        {...props}
        >
        <View style={{marginRight: 10, marginBottom: 5}}>
            <Image source={require('../img/send.png')} resizeMode={'center'}/>
        </View>
      </Send>
    );
  }

  render() {
     const { user, isFetchingMessage, pmNum, pmType, toUsername, pmSubject } = this.props;
     const { messages } = this.state;
     return (
       <View style={{flex: 1, backgroundColor: 'white'}}>
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
          <Text style={styles.topBarText}>
            {pmType=== 1 ?
              `${toUsername}` :
              `群聊: ${pmSubject}`
            }
          </Text>
        </View>
          { (messages.length !== 0) &&
             <GiftedChat
              messages={messages}
              onSend={(newMessage) => this.onSend(newMessage)}
              user={{
                _id: eval(user.uid),
                avatar: `http://www.bucssa.net/uc_server/data/avatar/000/00/00/${user.uid}_avatar_big.jpg?random_number=${new Date().getTime()}`,
              }}
              placeholder='请输入...'
              loadEarlier={messages.length < pmNum}
              onLoadEarlier={this.onLoadEarlier}
              renderBubble={this.renderBubble}
              renderTime={this._renderTime}
              renderSend={this._renderSend}
              showUserAvatar={true}
            />
        }
        </View>
     )
  }
}

const styles = StyleSheet.create({
  topBar: {
    height: windowHeight * (124/1334),
    backgroundColor: '#c03431',
    width: windowWidth,
    alignItems: 'center',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowColor: 'black',
    shadowOffset: { height: 2, width: 2 },
    zIndex: 2,
  },
  topBarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    bottom: windowHeight * (25/1334),
    position: 'absolute',
  },
  textInput: {
    marginLeft: 15,
    fontSize: 18,
  },
  avatarContainer: {
    height: windowHeight * (50/1334),
    width: windowHeight * (50/1334),
    borderRadius: Dimensions.get('window').height * (25/1334),
    overflow: 'hidden'
  },
  avatar: {
    height: windowHeight * (50/1334),
    width: windowHeight * (50/1334),
  },
  inputToolbar: {
    width: windowWidth,
    height: windowHeight * (90/1334),
    backgroundColor: '#f9685d',
    justifyContent: 'center',
  },
  sendImg: {
    width: windowWidth * (75/750),
    height: windowHeight * (50/1334),
  },
  separator: {
    height: 1,
    width: Dimensions.get('window').width * (65/75),
    backgroundColor: "#e77163",
    position: 'absolute',
    bottom: 1,
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
  }

});

export default connect(mapStateToProps)(MessagePage)
