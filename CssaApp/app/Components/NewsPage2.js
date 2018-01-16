/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
  View,
  Image,
  Alert,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text,
  Button,
} from 'react-native';
import StatusBarAlert from 'react-native-statusbar-alert';
import {connect} from 'react-redux';
import { Icon } from 'react-native-elements'
import {Col, Row, Grid} from 'react-native-easy-grid';
import { Actions } from 'react-native-router-flux';
import Swiper from 'react-native-swiper';

import Footer from './Footer';
import NewsCard from './NewsCard';
import {
  fetchNews,
  receiveNews,
  refreshNews
} from '../actions/newsPage';
import {
  fetchThreadCollection,
  requestAddThread,
  requestDeleteThread
 } from  '../actions/newsCollectionAction';



//The props is passed to this level of newsPage
const mapStateToProps = (state) => ({
  initialOffset: state.newsPageReducer.newsOffset,
  newsList: state.newsPageReducer.newsList,
  isFetching: state.newsPageReducer.isFetching,
  user: state.userReducer.userData,
  collectionList: state.collectionReducer.collectionList,
  tidList: state.collectionReducer.tidList,
  isConnected: state.networkReducer.isConnected,
})

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


class NewsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: this.props.initialOffset,
      listLength: this.props.newsList.length, //Will change later
      contentHeight: 0,
      readyToRefresh: false,
      refreshing: false,
    }
  }

  addToCollection = (tid, subject, author, dateline) => {
    const { dispatch, user, isConnected } = this.props;
    if (isConnected) {
      dispatch(
        requestAddThread(user.uid, tid, subject, author, dateline, user.token)
      );
    }
  }

  deleteFromCollection = (tid, subject, author, dateline) => {
    const { dispatch, user, isConnected } = this.props;
    if (isConnected) {
      dispatch(
        requestDeleteThread(user.uid, tid, subject, author, dateline, user.token)
      );
    }
  }


  setCurrentReadOffset = (event) => {
    const yCoord = (event.nativeEvent.contentOffset.y);
    if (yCoord < -(windowHeight * (170/1334)) && this.props.isConnected) {
      this.setState({
        readyToRefresh: true
      })
    }
  }

  componentDidMount() {
    const { dispatch, user, collectionList, isConnected } = this.props;
    const { listLength } = this.state;

    //Fetch news
    if (listLength === 0 && isConnected){
      dispatch(
        fetchNews(current_page_index = this.props.newsList.length / 10, user.uid)
      );
    }

    if (user !== undefined && isConnected) {
      dispatch(fetchThreadCollection(user.uid, user.token));
    }

  }


  goToWeb = (link) => {
    Actions.webPage({this_url:link});
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    setTimeout(() => {
      this.setState({refreshing: false});
    }, 2000);
  }

  handleListEndReach = () => {
    const { dispatch, isFetching, isConnected} = this.props;

    if (!isFetching && isConnected) {
      dispatch(fetchNews(current_page_index = this.props.newsList.length / 10));
    }
  }

  handleRelease = (event) => {
    if (this.state.readyToRefresh) {
      const { dispatch, user, isConnected } = this.props;
      this.refs.NewsList.scrollToOffset({offset: -(windowHeight * (170/1334))});

      if (isConnected) {
        this.setState({ refreshing: true }, () => {
          dispatch(refreshNews(user.uid))
        })
        setTimeout(() => {
          this.refs.NewsList.scrollToOffset({offset: 0});
          this.setState({ refreshing: false })
        }, 3000)
      }
    }
    return this.setState({ readyToRefresh: false });
  }

  _keyExtractor = (item, index) => index;

  _renderItem = ({item}) => {
    const loggedIn = this.props.user !== undefined;
    if (Array.isArray(item)) {
      return (
        <View
          style={{backgroundColor: 'white',
                  paddingBottom: 20,
                  paddingTop: 20}}
            >
          <Swiper
            width={Dimensions.get('window').width * (61/75)}
            height={150}
            loop={true}
            autoplay={true}
            autoplayTimeout={3}
            paginationStyle={{
              bottom: 10, left: null, right: 10
            }}
            activeDot={<View style={styles.swiperActiveDot} />}
            dot={<View style={styles.swiperDot} />}
          >
              {
                item.map((swiperObj, index) => {
                  return (
                    swiperObj.hasImage ?
                    <View
                      style={{
                        width:Dimensions.get('window').width * (61/75),
                        height:150,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      key={index}
                        >
                      <Image style={styles.newsPoster} source={{uri:swiperObj.image}} />
                    </View>
                    :
                    <View
                    style={{
                      width:Dimensions.get('window').width * (61/75),
                      height:150,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    key={index}>
                      <Text style={{fontSize: 40}}>{swiperObj.text}</Text>
                    </View>

                  )
                })
              }
          </Swiper>
        </View>
      )
    } else {
      const { tidList } = this.props;
      const inCollection = tidList && tidList.includes(item.tid);
      return (
        <NewsCard
          newsObj={item}
          isLoggedIn={loggedIn}
          addAction={this.addToCollection}
          deleteAction={this.deleteFromCollection}
          isInCollection={inCollection}
          isTransparent={false}
          />
      );
    }
    return null;
  }


  render() {
    const { initialOffset, isFetching, newsList, tidList, user } = this.props;
    const {refreshing} = this.state;

    if (user !== undefined) {
      console.log(user);
    }

    const swiperDummy = [
      {
        imageUrl:'https://media.giphy.com/media/5bQtihx7wT5QI/giphy.gif',
        hasImage: true,
        text: '欢迎！'
      },
      {
        text:' 大家来！',
        hasImage: true,
        imageUrl:'https://i2.wp.com/marunews.com/wp-content/uploads/2016/12/%E7%9F%B3%E5%8E%9F%E3%81%95%E3%81%A8%E3%81%BF_%E3%83%98%E3%82%A2%E3%82%A2%E3%83%AC%E3%83%B3%E3%82%B8.jpg',
      },
      {
        text: '技术部！',
        hasImage: true,
        imageUrl:'http://i.imgur.com/EmoheJJ.jpg',
      },
      {
        hasImage: true,
        imageUrl:'http://nihongogo.com/wordpress/wp-content/uploads/2016/05/Satomi-Ishihara-Featured-as-Newest-Face-of-Tokyo-Metro-620x400.jpg',
      },
    ]

    let pageData = [swiperDummy, ...newsList];

    return (
      <View style={styles.scrollview}>
        <StatusBarAlert
            visible={!this.props.isConnected}
            message="网络异常... 请检查网络"
            backgroundColor="firebrick"
            color="white"
            style={styles.alert}
        />
        <View
          style={styles.topBar}
        >
            <Image
            style={styles.topBarImage}
            source={require('../img/topBarImage.png')}
              />
        </View>
        <View style={styles.refreshView}>
        {
          refreshing ?
          <Image
          style={styles.refreshImg}
          source={require('../img/refreshing.gif')}
          />
          :
          <Image
          style={styles.refreshImg}
          source={require('../img/pull.gif')}
          />
        }
        </View>
        <View style={styles.listView}>
        { (!user || tidList) &&
            <FlatList
              data={pageData}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={0.2}
              onEndReached={this.handleListEndReach}
              onResponderRelease={this.handleRelease}
              onScroll={this.setCurrentReadOffset}
              scrollEventThrottle={60}
              ref='NewsList'
              refreshing ={this.state.refreshing}
              extraData={this.props.tidList}
            />
          }
        </View>
        <View style={styles.newsBottomView}>
          <View style={styles.iconsView}>
            <Grid>
              <Col style={{alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity>
                  <Image
                    style={styles.icon}
                    source={require('../img/bookmark.png')}
                   />
                </TouchableOpacity>
                <Text style={styles.iconText}>新生手册</Text>
              </Col>
              <Col style={{alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity>
                  <Image
                    style={styles.icon}
                    source={require('../img/dot.png')}
                   />
                </TouchableOpacity>
                 <Text style={styles.iconText}>找室友</Text>
              </Col>
              <Col style={{alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity
                  onPress={() => Actions.classmateHome()}
                  >
                  <Image
                    style={styles.icon}
                    source={require('../img/book.png')}
                   />
                 </TouchableOpacity>
                <Text style={styles.iconText}>找课友</Text>
              </Col>
            </Grid>
          </View>
        </View>
        <Footer
          current={Actions.currentScene}
          />
        <Image style={styles.doggy} source={require('../img/doggy.png')} />
      </View>

    );
  }
}


const styles = StyleSheet.create({
  scrollview: {
    flex: 1,
    backgroundColor: 'white',
  },
  listView: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: windowHeight * (124/1334),
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    height: Dimensions.get('window').height * (840/1334),
    marginBottom: Dimensions.get('window').height * (24/1334),
    zIndex: 3,
  },
  refreshView: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: windowHeight * (124/1334),
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    zIndex: 3,
  },
  refreshImg: {
    height: windowHeight * (150/1334),
    width: windowHeight * (150/1334),
    marginTop: windowHeight * (30/1334)
  },
  newsBottomView: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: Dimensions.get('window').height * (984/1334),
    left: 0,
    right: 0,
    bottom: 0,
    height: Dimensions.get('window').height * (250/1334),
    zIndex: 3,
  },
  topBar: {
    height: windowHeight * (124/1334),
    backgroundColor: '#ededed',
    alignItems: 'center',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowColor: 'black',
    shadowOffset: { height: 2, width: 2 },
    zIndex: 5,
  },
  topBarImage: {
    position: 'absolute',
    height: windowWidth * (65/75) * (81/650),
    width: windowWidth * (65/75),
    overflow: 'hidden',
    bottom: 5,
  },
  row: {
    padding: 10,
    height: 125,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    marginBottom:-1,
    borderBottomColor: '#E5EDF5',
    borderTopColor: '#E5EDF5',
    borderBottomWidth: 1,
  },
  text: {
    textAlign: 'center',
    color: '#A4C8D9'
  },
  navText: {
    color: '#A4C8D9',
    fontSize: 20,
    fontWeight: "700",
    textAlign: 'center',
    paddingTop: 30
  },
  newsPoster: {
        height: 150,
        width: 150,
        position: 'relative',
  },
  swiperDot: {
        backgroundColor:'rgba(4,5,3,.8)',
        width: 6,
        height: 6,
        borderRadius: 3,
        marginLeft: 2,
        marginRight: 2,
        marginTop: 2,
        marginBottom: 0
  },
  swiperActiveDot: {
        backgroundColor: 'cornflowerblue',
        width: 6,
        height: 6,
        borderRadius: 3,
        marginLeft: 2,
        marginRight: 2,
        marginTop: 2,
        marginBottom: 0
  },
  newsBottom: {
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height:  Dimensions.get('window').height * (90/1334),
    position: 'absolute',
    top: Dimensions.get('window').height * (160/1334),
    zIndex: 4,
  },
  doggy: {
    height:  Dimensions.get('window').height * (255/1334),
    width: Dimensions.get('window').height * (255/1334) * (278/267),
    position: 'absolute',
    bottom: Dimensions.get('window').height * (75/1334),
    left: Dimensions.get('window').width * (20 / 750),
    zIndex: 99,
  },
  footer: {
    height:  Dimensions.get('window').height * (100/1334),
    width: Dimensions.get('window').width,
    backgroundColor: '#f2b7b0',
    zIndex: 3,
    position: 'absolute',
    top: Dimensions.get('window').height * (1234/1334),
  },
  iconsView: {
    height:  Dimensions.get('window').height * (120/1334),
    width: Dimensions.get('window').width * (330/750),
    position: 'absolute',
    right: Dimensions.get('window').width * (50/750),
    top: Dimensions.get('window').height * (70/1334),
    backgroundColor: 'transparent'
  },
  icon: {
    height: 45,
    width: 45,
    marginBottom: 10,
  },
  iconText: {
    fontSize: 13,
    color: '#c03431',
  }
})

export default connect(mapStateToProps)(NewsPage)
