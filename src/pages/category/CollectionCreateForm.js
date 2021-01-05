import React,{useEffect} from 'react';
import {Button, Modal, Form, Input, Select, message} from 'antd';

const { Option } = Select;
const CollectionCreateForm = ({ visible, onCreate, onCancel, name, category }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue({category:name});
    }, [form,name]);
    const onReset = () => {
        form.resetFields();
    };
    const cancel = () =>{
        onReset();
        onCancel()
    };
    const update = () =>
       category.map(item=>
            <Option key={item._id} value={item.name}>{item.name}</Option>);
    return (
        <Modal
            visible={visible}
            title="Create a new collection"
            okText="Create"
            cancelText="Cancel"
            onCancel={cancel}
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
                    name="category"
                    label="Category"
                    rules={[
                        {
                            required: true,
                        },
                    ]}>
                    <Select>
                        <Option value='0'>First class category</Option>
                        {update()}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}>
                    <Input placeholder="Please enter category name"/>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="button" onClick={onReset}>
                        Reset
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default CollectionCreateForm