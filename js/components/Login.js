import React, { Component } from "react";

import { ScrollView, StyleSheet, TextInput } from "react-native";

import Container from "./Container";
import Button from "./Button";
import Label from "./Label";


export default class Login extends Component {

  state = {
    host: this.props.host,
    username: ''
  };

  render() {
    return (
      <ScrollView style={styles.scroll}>
        <Container>
          <Label text="Username" styles={{ textLabel: styles.usernameLabel }}/>
          <TextInput
            secureTextEntry={false}
            style={styles.usernameInput}
            ref={(el) => {
              this.username = el;
            }}
            onChangeText={(username) => this.setState({ username })}
            value={this.state.username}
          />
        </Container>

        <Container>
          <Label text="Token provider host" styles={{ textLabel: styles.hostLabel }}/>
          <TextInput
            secureTextEntry={false}
            style={styles.hostInput}
            ref={(el) => {
              this.host = el;
            }}
            onChangeText={(host) => this.setState({ host })}
            value={this.state.host}
          />
        </Container>

        <Container>
          <Button
            label="Login"
            styles={{ button: styles.primaryButton, label: styles.buttonWhiteText }}
            onPress={this.press.bind(this)} title="Login"/>
        </Container>
      </ScrollView>
    );
  }

  press() {
    if (this.state.username && this.state.host) {
      console.log('logging in with username ' + this.state.username + ' and token provider host ' + this.state.host);
      this.props.login(this.state.username, this.state.host);
    }
  }
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    flexDirection: 'column'
  },
  usernameInput: {
    height: 80,
    fontSize: 30,
    backgroundColor: '#FFFFFF'
  },
  hostInput: {
    height: 40,
    fontSize: 15,
    backgroundColor: '#FFFFFF'
  },
  usernameLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Verdana',
    marginBottom: 10,
    color: '#0D122B'
  },
  hostLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Verdana',
    marginTop: 10,
    marginBottom: 5,
    color: '#0D122B'
  },
  primaryButton: {
    backgroundColor: '#F22F46'
  },
  buttonWhiteText: {
    fontSize: 20,
    color: '#FFF',
  },
});