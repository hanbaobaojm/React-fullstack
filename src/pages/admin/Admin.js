import React from 'react';
import {Redirect,Route,Switch} from 'react-router-dom';
import { Layout } from 'antd';
import memoryUtils from "../../utils/memoryUtils";
import LeftNav from "../../components/leftnav/LeftNav";
import Header from "../../components/header/Header";
import Category from "../category/Category";
import Bar from "../charts/Bar";
import Linechart from "../charts/Line";
import Pie from "../charts/Pie";
import Product from "../product/Product";
import Role from "../role/Role";
import User from "../user/User";
import Home from "../home/Home";
/*
admin routing component
*/

const { Footer, Sider, Content } = Layout;
class Admin extends React.Component {
    //console.log(Admin.location.pathname)
    user = memoryUtils.user;

    render() {
        if (!this.user || !this.user._id) {
            //not login, go to login page
            return <Redirect to='/login'/>
        }
        return (
            <Layout style={{height: '100%'}}>
                <Sider>
                    <LeftNav path={this.props.location.pathname}/>
                </Sider>
                <Layout>
                    <Header user={this.user.username} path={this.props.location.pathname}>Header</Header>
                    <Content style={{margin:20, backgroundColor: 'white'}}>
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/user' component={User}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/pie' component={Pie}/>
                            <Route path='/line' component={Linechart}/>
                            <Route path='/bar' component={Bar}/>
                            <Redirect to='/home'/>
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center', color: '#cccccc'}}>Use Chrome to get better
                        experience!</Footer>
                </Layout>
            </Layout>
        )
    }
}
export default Admin