
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';

import { Card, ListItem, Button, Icon } from 'react-native-elements';
import {Actions} from 'react-native-router-flux';
import {Col, Row, Grid} from 'react-native-easy-grid';

export default class NewsCard extends Component {
  constructor(props) {
    super(props);
    this.news = this.props.newsObj;
  }

  goToWeb(link) {
    return Actions.webPage({this_url:link});
  }

  render() {
    const { index, addAction, isLoggedIn, isInCollection, deleteAction, isTransparent } = this.props
    const {tid, dateline, subject, author, url, isCollected} = this.props.newsObj
    const viewHeight = subject.length / 22.0 * 22.0 + 22.0;
    return (
      <View style={{
        width: Dimensions.get('window').width * (61/75),
        paddingBottom: 20,
        backgroundColor: isTransparent ? 'transparent' : 'white'
      }}>
          <Grid>
            <Col size={0.2} style={{alignItems:'flex-start', backgroundColor: 'gray', marginRight: 10}}>
            </Col>
            <Col size={12}>
              <TouchableOpacity onPress={() => this.goToWeb(url)}>
                <Text style={{fontSize: 14, fontWeight: 'bold', marginBottom: 5}}>{subject}</Text>
                <Text style={{fontSize: 10}}> by {author}, {new Date(eval(dateline)*1000).toLocaleDateString()} </Text>
              </TouchableOpacity>
            </Col>
            <Col size={2} style={{justifyContent: 'center', alignItems: 'flex-end'}}>
            {
              isLoggedIn ?
                (
                  isInCollection ?
                      <Icon
                      name='ios-heart'
                      type='ionicon'
                      color='red'
                      onPress={() => deleteAction(tid, subject, author, dateline)}
                      />
                    :
                      <Icon
                        name='ios-heart-outline'
                        type='ionicon'
                        color='red'
                        onPress={() => addAction(tid, subject, author, dateline)}
                      />
                )
                :
                null
            }
            </Col>
          </Grid>
       </View>
    )
  }
}

const styles = StyleSheet.create({

})
