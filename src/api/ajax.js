import axios from "axios";
import {message} from "antd";
//const baseUrl = '/api/persons'

export const reqLogin = (username,password) => {
    return new Promise((resolve,reject) => {
        let promise = axios.post('/login',{username,password});
        promise.then(response=>{
            resolve(response.data)
            // Success
        }).catch(error => {
            //failed
            message.error(error.message)
        })
    })
};
export const addUser = user => axios.post('/manage/user/add',user);
export const updateUser = user => axios.post('/manage/user/update',user);
export const deleteUser = (id) => axios.delete('/manage/user/delete',{data: {
        userId: id
    }});
export const getUser = () => axios.get('/manage/user/list');
export const getRole = () => axios.get('/manage/role/list');
export const addRole = (roleName) => axios.post('/manage/role/add',{roleName:roleName});
export const updateRole = role => axios.post('/manage/role/update',role);
export const getCategory = (parentId) => axios.get('/manage/category/list', {params: {parentId:parentId}});
export const getCategoryById = (categoryId) => axios.get('/manage/category/info', {params: {categoryId:categoryId}});
export const addCategory = category => axios.post('/manage/category/add',category);
export const updateCategory = category => axios.post('/manage/category/update', category);
export const deleteCategory = (id) => axios.delete('/manage/category/delete', {
    data: {
        categoryId: id
    }
});
export const getProduct = (pageNum,pageSize) => axios.get('/manage/product/list', {params: {pageNum:pageNum, pageSize:pageSize}});
export const updateProductStatus = ({productId, status}) => axios.post('/manage/product/updateStatus', {productId, status});
export const searchProduct = (pageNum,pageSize,productName) => axios.get('/manage/product/search', {params: {pageNum:pageNum, pageSize:pageSize, productName:productName}});
export const addProduct = product => axios.post('/manage/product/add',product);
export const updateProduct = product => axios.post('/manage/product/update',product);