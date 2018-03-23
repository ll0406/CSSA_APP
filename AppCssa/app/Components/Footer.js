import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {Col, Row, Grid} from 'react-native-easy-grid';

export default class Footer extends Component{
  render(){
    const goToNews = () => Actions.newsPage();
    const goToProfile = () => Actions.profilePage();
    const goToInbox = () => Actions.inbox();

    const {current} = this.props

    return(
      <View style={styles.footerView}>
        <Grid>
          <Col style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => Actions.newsPage()}
              >
              {
                current === 'newsPage' ?
                <Image
                style={styles.footerIcon}
                source={require('../img/home-red.png')}
                />
              :
                <Image
                style={styles.footerIcon}
                source={require('../img/home-white.png')}
                />
              }
            </TouchableOpacity>
            <Text style={current === 'newsPage' ? styles.selectedFont : styles.footerFont}>主页</Text>
          </Col>
          <Col style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => Actions.inbox()}
              >
              {
                current === 'inbox' ?
                <Image
                style={styles.footerIcon}
                source={require('../img/message-red.png')}
                />
              :
                <Image
                style={styles.footerIcon}
                source={require('../img/message-white.png')}
                />
              }
            </TouchableOpacity>
            <Text style={current === 'inbox' ? styles.selectedFont : styles.footerFont}>消息</Text>
          </Col>
          <Col style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => Actions.profilePage()}
              >
              {
                current === 'profilePage' ?
                <Image
                style={styles.footerIcon}
                source={require('../img/me-red.png')}
                />
              :
                <Image
                style={styles.footerIcon}
                source={require('../img/me-white.png')}
                />
              }
            </TouchableOpacity>
            <Text style={current === 'profilePage' ? styles.selectedFont : styles.footerFont}>账号</Text>
          </Col>
        </Grid>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  footerView: {
    height:  Dimensions.get('window').height * (100/1334),
    width: Dimensions.get('window').width,
    backgroundColor: '#c03431',
    zIndex: 3,
    position: 'absolute',
    top: Dimensions.get('window').height * (1234/1334),
  },
  footerIcon: {
    height: Dimensions.get('window').height * (35/1334),
    width: Dimensions.get('window').width * (90/750),
    marginBottom: Dimensions.get('window').height * (10/1334),
  },
  footerFont: {
    fontSize: 8,
    color: 'white',
  },
  selectedFont: {
    fontSize: 8,
    color: '#5f2a28',
  }

})
