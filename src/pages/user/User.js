import React, {useState,useEffect} from 'react';
import {Card, Button, Table, message, Space, Modal} from "antd";
import AddUser from "./AddUser";
import {getUser, addUser, updateUser, deleteUser, deleteCategory} from "../../api/ajax";
import LinkButton from "../../components/linkbutton/LinkButton";

const User = () => {
    const [userList, setUserList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [counter,setCounter]=useState(0);
    const [add, setAdd] = useState(false);
    const [user, setUser] = useState({});
    const [addTitle, setAddTitle] = useState('');
    const getUsers =()=>{
        getUser().then(response=>{
            if(response.data.status===0){
                console.log(response.data.data);
                const users = response.data.data.users;
                const roles = response.data.data.roles;
                setUserList(users);
                setRoleList(roles);
                setCounter(1)
            }
            else message.error(response.data.msg)
        }).catch(error=>message.error(error))
    };
    const addUsers=value=>{
        if(addTitle==='Add a user'){
            addUser(value).then(response=>{
                if(response.data.status===0){
                    console.log(response.data.data);
                    message.success('success added!');
                    setCounter(0)
                }
                else message.error(response.data.msg)
            }).catch(error=>message.error(error))
        }
        else{
            updateUser(value).then(response=>{
                if(response.data.status===0){
                    console.log(response.data.data);
                    message.success('success added!');
                    setCounter(0)
                }
                else message.error(response.data.msg)
            }).catch(error=>message.error(error))
        }
        console.log(value);
        setAdd(false);
    };
    const updateUsers=user=>{
        setAddTitle('Edit'+user.username);
        setAdd(true);
        setUser(user);
    };
    const delUser=user=>{
        const { confirm } = Modal;
        confirm({
            title: 'Are you Sure to delete ' + user.username +'?',
            onOk() {
                //console.log(Id,name);
                deleteUser(user._id).then(response=>{
                    if(response.data.status===0) {
                        //console.log(response.data)
                        message.success(user.username + ' has been deleted');
                        setCounter(0)
                    }
                    else{
                        message.error(response.data.msg)
                    }
                }).catch(error => message.error('Error: ' + error));
            },
        });
    };
    const columns = [
        {
            title: 'Name',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone number',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Create Time',
            dataIndex: 'create_time',
            key: 'create_time',
            render:(create_time)=>new Date(create_time).toLocaleString()
        },
        {
            title: 'Role',
            dataIndex: 'role_id',
            key: 'role_id',
            render: (role_id)=>{
                if(role_id && roleList.length>0){
                    //console.log(role_id,roleList);
                    return roleList.find(item=>item._id===role_id).name
                }}
        },
        {
            title: 'Action',
            key: 'action',
            width:300,
            render: (text) => (
                <Space size="middle">
                    <LinkButton click={()=>updateUsers(text)} text='Edit'/>
                    <LinkButton click={()=>{delUser(text)}} text='Delete'/>
                </Space>
            ),
        },
    ];
    useEffect(()=>{
        getUsers();
    },[counter]);
    return(
        <Card title={
            <span>
                <Button onClick={()=>{setAdd(true); setAddTitle('Add a user')}} type="primary">New User</Button>
            </span>}>
            <Table bordered
                   rowKey='_id'
                   columns={columns}
                   dataSource={userList}/>
            <AddUser visible={add}
                     onCreate={addUsers}
                     onCancel={()=>setAdd(false)}
                     user={user}
                     title={addTitle}
                     roleList={roleList}/>
        </Card>
    )
};
export default User