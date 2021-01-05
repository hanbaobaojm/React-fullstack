import React from 'react';
import {Modal, Form, message, Input} from "antd";

const AddForm=({ visible, onCreate, onCancel})=>{
    const [form] = Form.useForm();
    return(
        <Modal
            visible={visible}
            title="Create new role"
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
                        onCreate(values);
                    })
                    .catch((info) => {
                        message.error('Validate Failed:', info);
                    });
            }}>
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal">
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}>
                    <Input placeholder="Please enter role name"/>
                </Form.Item>
            </Form>
        </Modal>
    )
};
export default AddForm