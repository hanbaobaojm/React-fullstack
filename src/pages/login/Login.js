import React from 'react';
import {Redirect} from 'react-router-dom';
import './login.css';
import logo from '../../assets/images/writing.png';
import { Form, Input, Button, message} from 'antd';
import {reqLogin} from '../../api/ajax';
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
/*
login routing component
*/
class Login extends React.Component {
        render(){
            const user = memoryUtils.user;
            if(user && user._id){
                return <Redirect to = '/home'/>
            }
            //console.log(this.props)
        const onFinish = values => {
            reqLogin(values.username, values.password).then(response => {

                if (response.status === 0) {
                    // login success
                    message.success('Login Success!');
                    memoryUtils.user = response.data;
                    storageUtils.saveUser(response.data);
                    this.props.history.replace('/') //don't need to go back to login page
                } else {
                    message.error(response.msg)
                }
            });
            //console.log('Success:', values);
        };
        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };
        return (
            <div className='login'>
                <div className='loginHead'>
                    <img src={logo} alt={logo}/>
                    <h1>Background management system</h1>
                </div>
                <section className='loginBody'>
                    <h2>Login</h2>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{required: true, message: 'Please input your username!'}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{required: true, message: 'Please input your password!'}]}
                        >
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item>
                            <Button className='btn1' type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
export default Login