import React, {useState,useEffect} from 'react';
import {Card, Button, Table, message, Tree, Modal} from "antd";
import {getRole, addRole, updateRole} from "../../api/ajax";
import AddForm from "./AddForm";
import menuList from "../../config/menuConfig";
import {Input} from "antd/es";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";


const data = [{
    title: 'Platform Privilege',
    key: '0-0',
    children: menuList
}];
const Role = () => {
    const [roleList,setRoleList]=useState([]);
    const [role,setRole]=useState({});
    const [counter,setCounter]=useState(0);
    const [add,setAdd]=useState(false);
    const [set,setSet]=useState(false);
    const [checkedKeys, setCheckedKeys] = useState([]);
    //console.log(role.menus,checkedKeys)

    const getRoles =()=>{
        getRole().then(response=>{
            if(response.data.status===0){
                const role = response.data.data;
                //console.log(role)
                setRoleList(role);
                setCounter(1);
            }
            else message.error(response.data.msg)
        }).catch(error=>message.error(error))
    };
    const handleCancel = () => {
        setAdd(false);
        setCheckedKeys(role.menus);
        setSet(false)
    };
    const handleSubmit = (value) => {
        addRole(value.name).then(response=>{
            if(response.data.status===0){
                message.success(value.name+' Added');
                setAdd(false);
                setCounter(0);
            }
            else message.error(response.data.msg)
        }).catch(error=>message.error(error));
        //console.log(value)
    };
    const handleSetSubmit = (value) => {
        console.log(value);
        updateRole(role).then(response=>{
            if(response.data.status===0){
                message.success(role.name+' updated');
                setSet(false);
                setCounter(0);
                if(memoryUtils.user.role_id===role._id){
                    memoryUtils.user = {};
                    storageUtils.removeUser();
                    window.location.reload();
                    message.info('role permissions have been changed, please login again!')
                }
            }
            else message.error(response.data.msg)
        }).catch(error=>message.error(error));
    };
    const clickRow = record => {
        return {
            onClick: event => {
                //console.log(record)
                setRole(record);
            }
        }
    };
    const onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        setCheckedKeys(checkedKeys);
    };
    const columns = [
        {
            title: 'Role Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Create Time',
            dataIndex: 'create_time',
            key: 'ctime',
            render:(auth_time)=>new Date(auth_time).toLocaleString()
        },
        {
            title: 'Authorization Time',
            dataIndex: 'auth_time',
            key: 'atime',
            render:(auth_time)=>{
                if(auth_time)
                    return new Date(auth_time).toLocaleString()
            }
        },
        {
            title: 'Authorizer',
            dataIndex: 'auth_name',
            key: 'aname',
        },

    ];
    useEffect(()=>{
        getRoles();
    },[counter]);
    useEffect(()=>{
        setCheckedKeys(role.menus)
    },[role]);
    return(
        <Card title={
            <span>
                <Button onClick={()=>{setAdd(true)}} type="primary">New Role</Button> &nbsp;
                <Button onClick={()=>{setSet(true)}} type="primary" disabled={!role._id}>Set role permissions</Button>
            </span>}>
            <Table bordered
                   rowSelection={{
                       type: 'radio',
                       selectedRowKeys: [role._id],
                       onSelect: (role)=>{
                           setRole(role);
                       }
                   }}
                   rowKey='_id'
                   onRow={clickRow}
                   columns={columns}
                   dataSource={roleList}/>
                   <AddForm visible={add}
                            onCreate={handleSubmit}
                            onCancel={handleCancel}/>
            <Modal
                visible={set}
                title="Edit permissions"
                okText="Submit"
                cancelText="Cancel"
                onCancel={handleCancel}
                getContainer={false}
                destroyOnClose={true}
                onOk={() =>{
                    const values = role;
                    values.menus = checkedKeys;
                    values.auth_name = memoryUtils.user.username;
                    handleSetSubmit(values);
                    setSet(false)
                }}>
                Role Name: <Input value={role.name} disabled/>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                    treeData={data}/>
            </Modal>
        </Card>
    )
};
export default Role