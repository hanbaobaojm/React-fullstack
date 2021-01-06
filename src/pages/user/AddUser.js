import React, {useEffect} from 'react';
import {Modal, Form, message, Select, Input} from "antd";

const { Option } = Select;
const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
    },
};
const AddUser = ({ visible, onCreate, onCancel, user, title, roleList}) => {
    const [form] = Form.useForm();
    useEffect(() => {
        if(title!=='Add a user'){
        form.setFieldsValue({
            name:user.username,
            number:user.number,
            email:user.email,
            category:user.role_id,
            password:user.password
        })}
    }, [form,user]);
    const update = () =>
        roleList.map(item=>
            <Option key={item._id} value={item._id}>{item.name}</Option>);
    return(
        <Modal
            visible={visible}
            title={title}
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            getContainer={false}
            destroyOnClose={false}
            onOk={() =>{
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        let newUser = {};
                        if(title!=='Add a user')
                            newUser=user;
                        newUser.username = values.name;
                        newUser.email = values.email;
                        newUser.phone = values.number;
                        newUser.role_id = values.category;
                        newUser.password = values.password;
                        onCreate(newUser);
                    })
                    .catch((info) => {
                        message.error('Validate Failed:', info);
                    });
            }}>
            <Form
                form={form}
                layout="vertical"
                validateMessages={validateMessages}
                name="form_in_modal">
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}>
                    <Input placeholder="Please enter user name"/>
                </Form.Item>
                <Form.Item
                    hidden={title!=='Add a user'}
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                        },
                    ]}>
                    <Input.Password placeholder="Please enter password"/>
                </Form.Item>
                <Form.Item
                    name="number"
                    label="Mobile number">
                    <Input placeholder="Please enter mobile number"/>
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        {
                            type: 'email',
                        },
                    ]}>
                    <Input placeholder="Please enter email"/>
                </Form.Item>
                <Form.Item
                    name="category"
                    label="Category"
                    rules={[
                        {
                            required: true,
                        },
                    ]}>
                    <Select placeholder="Please select role">
                        {update()}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
};
export default AddUser