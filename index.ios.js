/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
//页面
var List = require('./app/creation/index');
var Edit = require('./app/edit/index');
var Account = require('./app/account/index');
var Login = require('./app/account/login');

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  Navigator,
  AsyncStorage,
} from 'react-native';


var imoocApp = React.createClass ({
  getInitialState(){
    return {
      user: null,
      selectedTab: 'list',
      logined: false //用户是否登录过
    }
  },
  //装载完组件调用
  componentDidMount(){
    this._asyncAppStatus()
  },
  //退出登录
  _logout(){
    AsyncStorage.removeItem('user')

    this.setState({
      logined: false,
      user: null
    })
  },
  //异步获取本地存储用户检查用户是否登录过
  _asyncAppStatus(){
    var that = this
    AsyncStorage.getItem('user')
      .then((data) => {
        var user
        var newState = {}
        //将data数据json格式字符串，转换成对象
        if(data){
          user = JSON.parse(data) 
        }
        //如果AsyncStorage本地存储有用户数据，就赋值给newState这个对象里
        if(user && user.accessToken){
          newState.user = user
          newState.logined = true
        }else{
          newState.logined = false
        }

        that.setState(newState)
      })
  },

  //接收子组件Login的用户数据
  _afterLogin(user){
    var that = this
    user = JSON.stringify(user)  //转换成json字符串
    AsyncStorage.setItem('user', user) //将用户登录的信息保存到本地存储AsyncStorage里（只能存储字符串）
      .then(() => {
        that.setState({
          logined: true,
          user: user
        })
      })
  },
  /*
   * initialRoute 初始化component 组件List
   * 从右边栏呼出（ Navigator.SceneConfigs.FloatFromRight ）
   * route.component 拿到初始化后组件List进行渲染出来
   * navigator 表示将navigator对象传递给组件List
   */
  render(){
    //用户没有登录，就跳到用户页面组件
    if(!this.state.logined){
      return <Login afterLogin={this._afterLogin}/>
    }

    return (
      <TabBarIOS tintColor="#ee735c">
        <Icon.TabBarItem
          iconName='ios-videocam-outline'
          selectedIconName='ios-videocam'
          selected={this.state.selectedTab === 'list'}
          onPress={() => {
            this.setState({
              selectedTab: 'list',
            });
          }}>
          <Navigator
            initialRoute={{
              name: 'list',
              component: List
            }}
            configureScene={(route) => {
              return Navigator.SceneConfigs.FloatFromRight  
            }}
            renderScene={(route, navigator) => {
              var Component = route.component 
              return <Component {...route.params} navigator={navigator} />
            }}
          />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName='ios-recording-outline'
          selectedIconName='ios-recording'
          selected={this.state.selectedTab === 'edit'}
          onPress={() => {
            this.setState({
              selectedTab: 'edit',
            });
          }}>
          <Edit />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName='ios-more-outline'
          selectedIconName='ios-more'
          selected={this.state.selectedTab === 'account'}
          onPress={() => {
            this.setState({
              selectedTab: 'account',
            });
          }}>
           <Account user={this.state.user} logout={this._logout} />
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  },
  
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('imoocApp', () => imoocApp);
