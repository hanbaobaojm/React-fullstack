import React from 'react';
import {Card, Button, Table, Space, Input, message, Pagination} from "antd";
import { PlusOutlined } from '@ant-design/icons';
import LinkButton from "../../components/linkbutton/LinkButton";
import {getProduct,updateProductStatus,searchProduct} from "../../api/ajax";

const { Search } = Input;

const productPerPage = 7;
class ProductHome extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            productList: [],
            pageNow:1,
            totalProduct:1,
            searchInput:''
        };
    }
    getProducts= (page, num) => {
        getProduct(page,num).then(response=>{
            if(response.data.status===0) {
                const product = response.data.data.list;
                const total = response.data.data.total;
                this.setState({
                    productList:product,
                    totalProduct:total
                });
                //console.log(product, total)
            }else
                message.error(response.data.msg)
        }).catch(error => message.error('Error: ' + error));
    };
    onChange = page => {
        this.setState({
            pageNow:page
        });
        this.state.searchInput===''?this.getProducts(page,productPerPage):
        this.searchProducts(this.state.searchInput,page)
    };
    updateStatus = (status,id) => {
        //console.log(status,id);
        const newStatus = status===1?2:1;
        updateProductStatus({productId:id, status: newStatus}).then(response =>{
            if(response.data.status===0) {
                this.state.searchInput===''?this.getProducts(this.state.pageNow,productPerPage):
                    this.searchProducts(this.state.searchInput,this.state.pageNow)
            }else
                message.error(response.data.msg)
        }).catch(error=>message.error(error))
    };
    searchProducts = (value,page) =>{
        searchProduct(page,productPerPage,value).then(response => {
            if(response.data.status===0){
                const product = response.data.data.list;
                const total = response.data.data.total;
                this.setState({
                    productList:product,
                    totalProduct:total
                })
               // console.log(product)
            }
            else
                message.error(response.data.msg)
        }).catch(error => message.error(error))
    };
    onSearch=value=>{
        this.setState({
            pageNow:1,
            searchInput: value
        });
        this.searchProducts(value,1)
    };
    showDetail=(value)=>{
        this.props.history.push('/product/detail',value)
    };

    columns = [
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'desc',
            key: 'description',
            width:600,
        },
        {
            title: 'Price(Euro)',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status,record) => {
                return(
                    <Space size="middle">
                        <span>{status===1? 'on sale':'sold out'}</span>
                        <LinkButton click={()=>{this.updateStatus(status,record._id)}} text={status===1? 'sold out':'on sale'}/>
                    </Space>
                )},
        },
        {
            title: 'Action',
            key: 'action',
            width:120,
            render: (text) => (
                <Space size="middle">
                    <LinkButton click={()=>this.props.history.push('/product/addupdate',text)} text='Edit'/>
                    <LinkButton click={() => this.showDetail(text)} text='Details'/>
                </Space>
            ),
        },
    ];
    componentDidMount() {
        this.getProducts(this.state.pageNow,productPerPage)
    }
    render() {
        return (
            <Card title={
                <span>
                <Search style={{width: 300}}
                        placeholder="item name"
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={this.onSearch}
                />
            </span>}
                  extra={<Button onClick={()=>this.props.history.push('/product/addupdate')} type="primary" icon={<PlusOutlined/>}>Add product</Button>}>
                <Table bordered
                       rowKey='_id'
                       columns={this.columns}
                       pagination={false}
                       dataSource={this.state.productList}/>
                <br/>
                <Pagination current={this.state.pageNow} style={{textAlign: 'right'}} defaultPageSize={productPerPage}
                            defaultCurrent={this.state.pageNow} total={this.state.totalProduct} onChange={this.onChange}/>

            </Card>
        )
    }
}
export default ProductHome