import React, { Component } from "react";

import { ScrollView, StyleSheet, Text } from "react-native";

import Container from "./Container";


export default class EventsLog extends Component {

  render() {
    return (
      <ScrollView
        ref='_scrollView'
        style={styles.scroll}
        onContentSizeChange={(contentWidth, contentHeight) => {
          this.refs._scrollView.scrollToEnd({ animated: true });
        }}>
        <Container>
          <Text>
            { this.props.eventslog }
          </Text>
          <Text>
            &nbsp;
          </Text>
        </Container>
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    flexDirection: 'column'
  }
});