import React from 'react';
import {Card, Table, Space, Button, message, Modal, Form, Input} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CollectionCreateForm from "./CollectionCreateForm";
import LinkButton from "../../components/linkbutton/LinkButton";
import './category.css'
import {getCategory,addCategory,updateCategory,deleteCategory} from '../../api/ajax';

class Category extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            subCategories: [],
            parentName:'First class classification',
            rank: '0',
            createVisible:false,
            updateVisible:false
        };
    }
    formRef = React.createRef();
    getDetail = (id,name) => {
        getCategory(id).then(response => {
            const category = response.data.data;
            if(id==='0') {
                this.setState({
                    categories: category,
                    parentName: 'First class classification',
                    rank: '0'
                })
            }
            else{
                this.setState({
                    subCategories: category,
                    parentName: <div><LinkButton click={()=> {this.setState({rank:'0', parentName: 'First class classification'})}} text='First class classification'/> {name} </div>,
                    rank: name
                })
            }
        }).catch(error => message.error('Error: ' + error));
    };
    createCategory = () => {
        this.setState({
            createVisible:true
        });
    };
    updateCategory = (name) => {
        //console.log(this.formRef.current);
        this.catName = name;
        if(this.formRef.current)
            this.formRef.current.setFieldsValue({name:name});
        this.setState({
            updateVisible:true
        })
    };
    delCategory = (Id,name) => {
        const { confirm } = Modal;
        const parent = this;
        confirm({
            title: 'Are you Sure to delete all categories related to ' + name +'?',
            onOk() {
                //console.log(Id,name);
                deleteCategory(Id).then(response=>{
                    if(response.data.status===0) {
                        //console.log(response.data)
                        message.success(response.data.data.deletedCount + ' categories have been deleted');
                        parent.getDetail('0', '')
                    }
                    else{
                        message.error(response.data.msg)
                    }
                }).catch(error => message.error('Error: ' + error));
            },
        });
    };
    handleCancel = () => {
        this.setState({
            createVisible:false,
            updateVisible:false
        })
    };
    handleSubmit = (value) => {
        let parentId;
        if(value.category==='0')
            parentId = '0';
        else{
            parentId = this.state.categories.find(item=>item.name===value.category)._id
        }
        const category = {
            name: value.name,
            parentId: parentId
        };
        //console.log(value.name,parentId);
        addCategory(category).then(response=>{
            if(response.data.status===0) {
                message.success('Success Added!');
                this.getDetail('0', '')
            }
            else{
                message.error(response.data.msg)
            }
        }).catch(error => message.error('Error: ' + error));
        this.handleCancel()
    };
    handleEdit = () => {
        this.formRef.current
            .validateFields()
            .then((values) => {
                this.formRef.current.resetFields();
                let parentId;
                if(this.state.rank==='0')
                    parentId = this.state.categories.find(item=>item.name===this.catName)._id;
                else
                    parentId = this.state.subCategories.find(item=>item.name===this.catName)._id;
                const category = {
                    categoryName: values.name,
                    categoryId: parentId
                };
                console.log(category);
                updateCategory(category).then(response=>{
                    console.log(response.data);
                    if(response.data.status===0) {
                        message.success('Success Changed!');
                        this.getDetail('0', '')
                    }
                    else{
                        message.error(response.data.msg)
                    }
                }).catch(error => message.error('Error: ' + error));

            })
            .catch((info) => {
                message.error('Validate Failed:', info);
            });
        this.handleCancel()
    };
    columns = [
            {
                title: 'Category Name',
                dataIndex: 'name',
                key: 'name',
                //render: text => <a>{text}</a>,
            },
            {
                title: 'Action',
                key: 'action',
                width:300,
                render: (text) => (
                    <Space size="middle">
                        <LinkButton click={()=>{this.updateCategory(text.name)}} text='Edit'/>
                        {/*<LinkButton click={()=>{this.delCategory(text._id,text.name)}} text='Delete'/>*/}
                        {this.state.rank === '0' ?
                            <LinkButton click={() => this.getDetail(text._id, text.name)} text='Details'/> : null
                        }
                    </Space>
                ),
            },
        ];
    componentDidMount() {
        this.getDetail('0','')
    }

    render() {
        return (
            <div className='category'>
                <Card title={this.state.parentName}
                      extra={<Button onClick = {this.createCategory} type="primary" icon={<PlusOutlined/>}>Add category</Button>}>
                    <Table bordered
                           rowKey='_id'
                           columns={this.columns}
                           dataSource={this.state.rank === '0'? this.state.categories:this.state.subCategories}/>
                </Card>
                <CollectionCreateForm
                    visible={this.state.createVisible}
                    onCreate={this.handleSubmit}
                    onCancel={this.handleCancel}
                    category = {this.state.categories}
                    name = {this.state.rank}/>
                <Modal title="Change category name"
                       visible={this.state.updateVisible}
                       onOk={this.handleEdit}
                       onCancel={this.handleCancel}>
                    <Form ref={this.formRef}
                        initialValues={{name: this.catName}}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}>
                            <Input/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}
export default Category