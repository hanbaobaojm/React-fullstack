import React,{useEffect,useState} from 'react';
import {Button, Card, Form, Input, Cascader, message} from "antd";
import {ArrowLeftOutlined} from '@ant-design/icons';
import {getCategory,addProduct,updateProduct} from "../../api/ajax";

const { TextArea } = Input;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
};
const addProducts = product=>{
    const item = {
        categoryId: product.category[1]?product.category[1]:product.category[0],
        pCategoryId: product.category[1]?product.category[0]:'0',
        name: product.name,
        price: product.price,
        desc: product.desc,
        status: 1
    };
    addProduct(item).then(response=>{
        if(response.data.status===0) {
            message.success('Success Added!')
        }
        else{
                message.error(response.data.msg)
            }
        }).catch(error => message.error('Error: ' + error));
};

const AddUpdate = (props) => {
    const [form] = Form.useForm();
    const [firstCategory, setFirstCategory] = useState([]); //parent category list
    const [childCategory, setChildCategory] = useState([]); //child category list
    const [count, setCount] = useState(0);
    const [options, setOptions] = useState([]);
    const [targetOption,setTargetOption] = useState({});
    //the data from product home page, undefined when press 'add' button
    let data = props.location.state;
    if(!data)
        data = {
            name:'',
            desc:'',
            price:0,
            categoryId:'0',
            pCategoryId:'0'
        };
    //get category list from the server
    function onChange(value) {
        //console.log(value);
    }
    const onFinish=values=>{
        if(props.location.state)
            updateProducts(values);
        else
            addProducts(values)
        //console.log(values)
    };
    const updateProducts = product=>{
        const item = {
            categoryId: product.category[1]?product.category[1]:product.category[0],
            pCategoryId: product.category[1]?product.category[0]:'0',
            name: product.name,
            price: product.price,
            desc: product.desc,
            _id: props.location.state._id,
            status: 1
        };
        updateProduct(item).then(response=>{
            if(response.data.status===0) {
                message.success('Success Changed!')
            }
            else{
                message.error(response.data.msg)
            }
        }).catch(error => message.error('Error: ' + error));
    };
    const getCategories = (id) => {
        getCategory(id).then(response => {
            const category = response.data.data;
            if(id==='0') {
                setFirstCategory(category);
                setCount(1);
            }
            else{
                setChildCategory(category)
            }
        }).catch(error => message.error('Error: ' + error));

    };
    //map category list into option list shown in the Cascader
    const category = cat =>{
        return cat.map(item=>{
            return(
            {
                value: item._id,
                label:item.name,
                isLeaf: false
            })
        })
    };
    const loadData = selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        setTargetOption(targetOption);
        //console.log(targetOption.label)
        targetOption.loading = true;

        getCategories(targetOption.value);

        //console.log(targetOption.value,targetOption.children);
        //setOptions([...options]);
    };
    useEffect(()=>{
        targetOption.loading = false;
        targetOption.children = childCategory.map(item=>{
            return(
                {
                    value: item._id,
                    label:item.name
                })
        });
        setOptions([...options]);
        console.log(options)
    },[childCategory]);
    useEffect(()=>{
        getCategories('0');
        const pcatList = category(firstCategory);
        if(data.pCategoryId!=='0'){
            setTargetOption(pcatList.find(item=>item.value===data.pCategoryId));
            getCategories(data.pCategoryId)
        }
        setOptions(pcatList)
        //console.log(options)
    },[count]);
    return(
        <Card title={
            <span>
            <ArrowLeftOutlined onClick={()=>window.history.back()} style={{color:'cornflowerblue'}}/>
            Add Product
            </span>
        }>
            <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
                <Form.Item name="name" initialValue={data.name} label="Product Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="desc" initialValue={data.desc} label="Product Description" rules={[{ required: true }]}>
                    <TextArea autoSize/>
                </Form.Item>
                <Form.Item name="price" initialValue={data.price} label="Product Price"
                           rules={[
                               {
                                   required: true
                               },
                               ({ getFieldValue }) => ({
                                   validator(rule, value) {
                                       if (!value || getFieldValue('price') >= 0) {
                                           return Promise.resolve();
                                       }

                                       return Promise.reject('The price must be valid!');
                                   },
                               }),
                           ]}>
                    <Input type='number' suffix="Euro" />
                </Form.Item>
                <Form.Item name="category" label="Product Category" rules={[{required: true}]}
                           initialValue={data.categoryId==='0'?[]:(data.pCategoryId==='0'?[data.categoryId]:[data.pCategoryId, data.categoryId])} >
                    <Cascader options={options} loadData={loadData} onChange={onChange} placeholder="Please select" changeOnSelect/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
};
export default AddUpdate