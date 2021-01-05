import React, {useState}from 'react';
import './header.css'
import {Modal} from "antd";
import menuList from "../../config/menuConfig";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import LinkButton from "../linkbutton/LinkButton";

const page = (path) => {
    if(path.indexOf('/product')>=0)
        path = '/product';
    let title;
    menuList.forEach(citem => {
        //console.log('key: ' + citem.key)
        if(citem.key===path) {
            title = citem.title;
        }
        else if(citem.children){
            const t = citem.children.find(item => item.key===path);
            if(t){
                title = t.title;
            }
        }
    });
    return title;
};
const { confirm } = Modal;
let inter;
function showConfirm() {
    confirm({
        title: 'Are you Sure to sign out?',
        onOk() {
            console.log('OK');
            storageUtils.removeUser();
            memoryUtils.user = {};
            clearInterval(inter);
            //link = "login"
            window.location.reload();
        },
    });
}
const Header = ({user,path}) => {
    const [time, setTime]=useState(new Date().toLocaleString());
    inter = setInterval(()=>{
            const currentTime = new Date().toLocaleString();
            setTime(currentTime);
        },1000);
    return(
        <div className='header'>
            <div className='headerTop'>
                <span>Welcome, {user}</span>
                <LinkButton click={showConfirm} text='Sign out'/>
            </div>
            <div className='headerBottom'>
                <div className='headerBottomLeft'>{page(path)}</div>
                <div className='headerBottomRight'>{time}</div>
            </div>

        </div>
    )
}
export default Header