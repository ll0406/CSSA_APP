import React, { Component } from 'react';
import { View } from 'react-native'
import {Motion, spring} from "react-motion";

export default class FadeIn extends Component {
    render() {
        return (
            <Motion key={this.props.motionkey} defaultStyle={{opacity: 0}} style={{opacity: spring(1)}}>
                {
                    interpolatingStyle =>
                        <View style={interpolatingStyle}>
                            {this.props.children}
                        </View>
                }
            </Motion>
        )
    }
}
