import React, {useState,useEffect} from 'react';
import {Card, List,message} from "antd";
import {ArrowLeftOutlined} from '@ant-design/icons';
import {getCategoryById} from "../../api/ajax";

const ProductDetails = (props) => {
    const[cname,setCname] = useState('');
    const[pname,setPname] = useState('');
    const data = props.location.state;
    console.log(data)
    const findCategory = (cid,pid)=>{
        getCategoryById(cid).then(response=>{
            if(response.data.status===0){
                const name = response.data.data.name;
                setCname(name)
            }
            else
                message.error(response.data.msg)
        }).catch(error=>message.error(error));
        if(pid!=='0'){
            getCategoryById(pid).then(response=>{
                if(response.data.status===0){
                    const name2 = response.data.data.name;
                    setPname(name2)
                }
                else
                    message.error(response.data.msg)
            }).catch(error=>message.error(error))
        }
    };
    useEffect(()=>{
        findCategory(data.categoryId,data.pCategoryId)
    },[data.categoryId,data.pCategoryId]);
    return(
        <Card title={<span><ArrowLeftOutlined onClick={()=>window.history.back()} style={{color:'cornflowerblue'}}/>Back</span>}>
            <List>
                <List.Item>
                    <span className='left'>Product Name:</span>{data.name}
                </List.Item>
                <List.Item>
                    <span className='left'>Product Description:</span>{data.desc}
                </List.Item>
                <List.Item>
                    <span className='left'>Price:</span>{data.price} Euro
                </List.Item>
                <List.Item>
                    <span className='left'>Product Category:</span>{pname===''?cname:cname+' -> '+pname}
                </List.Item>
            </List>
        </Card>
    )
};
export default ProductDetails