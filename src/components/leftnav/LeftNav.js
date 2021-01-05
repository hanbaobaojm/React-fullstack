import React from 'react';
import {Link} from 'react-router-dom'
import { Menu } from 'antd';
import './leftnav.css';
import logo from '../../assets/images/writing.png';
import menuList from "../../config/menuConfig";
import memoryUtils from "../../utils/memoryUtils";

const { SubMenu } = Menu;

const LeftNav = ({path}) => {
    if(path.indexOf('/product')>=0)
        path = '/product';
    //console.log(path);
    let openKey = '/';
    const hasAuth= item =>{
        const key = item.key;
        const menus = memoryUtils.user.role.menus;
        const username = memoryUtils.user.username;
        if(username==='admin'||item.isPublic||menus.indexOf(key)>=0)
            return true;
        else if(item.children){
            return !!item.children.find(child=>menus.indexOf(child.key)>=0)
        }
        return false
    };
    const getMenuNodes = (menuList) => {
        return menuList.map(item => {
            if(hasAuth(item)) {
                if (item.children) {
                    const cItem = item.children.find(citem => citem.key === path);
                    if (cItem) {
                        openKey = item.key;
                        // console.log(openKey);
                    }
                    return (
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {getMenuNodes(item.children)}
                        </SubMenu>
                    )
                } else {
                    return (
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.key}>
                                {item.title}
                            </Link>
                        </Menu.Item>
                    )
                }
            }
        })
    }
 const menuNodes = getMenuNodes(menuList);
 return (
        <div className='leftNav'>
            <Link to='/home' className='leftNav-header'>
                <img src={logo} alt='logo'/>
                <h1>Management System</h1>
            </Link>
            <div style={{ width: 200 }}>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {menuNodes}
                </Menu>
            </div>
        </div>
    )
}
export default LeftNav