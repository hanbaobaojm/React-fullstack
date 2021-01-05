const express = require('express');
const md5 = require('blueimp-md5');
const UserModel = require('../database/user');
const RoleModel = require('../database/roles');
const CategoryModel = require('../database/category');
const ProductModel = require('../database/product');
const router = express.Router();

//login
router.post('/login', (req, res) => {
    const {username, password} = req.body;
    // Search users based on username and password in the database
    UserModel.findOne({username, password: md5(password)})
        .then(user => {
            if (user) { // login success
                // create cookie(userid: user._id), saved in browser
                res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24});
                if (user.role_id) {
                    RoleModel.findOne({_id: user.role_id})
                        .then(role => {
                            user._doc.role = role;
                            console.log('role user', user);
                            res.send({status: 0, data: user})
                        })
                } else {
                    user._doc.role = {menus: []};
                    // return information about succeed login user
                    res.send({status: 0, data: user})
                }

            } else {// login failed
                res.send({status: 1, msg: 'Wrong user name or password!'})
            }
        })
        .catch(error => {
            console.error('Cannot login', error);
            res.send({status: 1, msg: 'Cannot login, please try again!'})
        })
});
//add user
router.post('/manage/user/add', (req, res) => {
    // 读取请求参数数据
    const {username, password} = req.body;
    // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
    // 查询(根据username)
    UserModel.findOne({username})
        .then(user => {
            // 如果user有值(已存在)
            if (user) {
                // 返回提示错误的信息
                res.send({status: 1, msg: 'The user has already existed'});
                return new Promise(() => {
                })
            } else { // 没值(不存在)
                // 保存
                return UserModel.create({...req.body, password: md5(password || 'hanbaobao')})
            }
        })
        .then(user => {
            // 返回包含user的json数据
            res.send({status: 0, data: user})
        })
        .catch(error => {
            console.error('注册异常', error);
            res.send({status: 1, msg: '添加用户异常, 请重新尝试'})
        })
});
// update user
router.post('/manage/user/update', (req, res) => {
    const user = req.body;
    UserModel.findOneAndUpdate({_id: user._id}, user)
        .then(oldUser => {
            const data = Object.assign(oldUser, user);
            // 返回
            res.send({status: 0, data})
        })
        .catch(error => {
            console.error('更新用户异常', error);
            res.send({status: 1, msg: '更新用户异常, 请重新尝试'})
        })
});
// delete user
router.delete('/manage/user/delete', (req, res) => {
    const {userId} = req.body;
    UserModel.remove(CategoryModel.find({_id: userId}))
        .then(category => {
            res.send({status: 0, data: category})
        })
        .catch(error => {
            console.error('删除异常', error);
            res.send({status: 1, msg: '删除异常, 请重新尝试'})
        })
});
// get user
router.get('/manage/user/list', (req, res) => {
    UserModel.find({username: {'$ne': 'admin'}})
        .then(users => {
            RoleModel.find().then(roles => {
                res.send({status: 0, data: {users, roles}})
            })
        })
        .catch(error => {
            console.error('获取用户列表异常', error);
            res.send({status: 1, msg: '获取用户列表异常, 请重新尝试'})
        })
});

// add role
router.post('/manage/role/add', (req, res) => {
    const {roleName} = req.body;
    RoleModel.create({name: roleName})
        .then(role => {
            res.send({status: 0, data: role})
        })
        .catch(error => {
            console.error('添加角色异常', error);
            res.send({status: 1, msg: 'Error: '+error})
        })
});
// get role
router.get('/manage/role/list', (req, res) => {
    RoleModel.find()
        .then(roles => {
            res.send({status: 0, data: roles})
        })
        .catch(error => {
            console.error('获取角色列表异常', error);
            res.send({status: 1, msg: '获取角色列表异常, 请重新尝试'})
        })
});
// update role permissions
router.post('/manage/role/update', (req, res) => {
    const role = req.body;
    role.auth_time = Date.now();
    RoleModel.findOneAndUpdate({_id: role._id}, role)
        .then(oldRole => {
            // console.log('---', oldRole._doc)
            res.send({status: 0, data: {...oldRole._doc, ...role}})
        })
        .catch(error => {
            console.error('更新角色异常', error);
            res.send({status: 1, msg: 'update error: '+error})
        })
});

//add category
router.post('/manage/category/add', (req, res) => {
    const {name, parentId} = req.body;
    //console.log(name);
    CategoryModel.create({name: name, parentId: parentId || '0'})
        .then(category => {
            res.send({status: 0, data: category})
        })
        .catch(error => {
            console.error("Error! ", error);
            res.send({status: 1, msg: 'Error! Please try again!'})
        })
});
// get category
router.get('/manage/category/list', (req, res) => {
    const parentId = req.query.parentId || '0';
    CategoryModel.find({parentId})
        .then(categorys => {
            res.send({status: 0, data: categorys})
        })
        .catch(error => {
            console.error('Get list error!', error);
            res.send({status: 1, msg: 'Get list error! Please try again!'})
        })
});
// update category
router.post('/manage/category/update', (req, res) => {
    const {categoryId, categoryName} = req.body;
    CategoryModel.findOneAndUpdate({_id: categoryId}, {name: categoryName})
        .then(oldCategory => {
            res.send({status: 0})
        })
        .catch(error => {
            console.error('更新分类名称异常', error);
            res.send({status: 1, msg: '更新分类名称异常, 请重新尝试'})
        })
});
// 根据分类ID获取分类
router.get('/manage/category/info', (req, res) => {
    const categoryId = req.query.categoryId;
    CategoryModel.findOne({_id: categoryId})
        .then(category => {
            res.send({status: 0, data: category})
        })
        .catch(error => {
            console.error('获取分类信息异常', error);
            res.send({status: 1, msg: error})
        })
});
//delete all categories related to ID
router.delete('/manage/category/delete', (req, res) => {
    const {categoryId} = req.body;
    CategoryModel.remove(CategoryModel.find({$or:[{ _id: categoryId }, { parentId: categoryId }]}))
        .then(category => {
            res.send({status: 0, data: category})
        })
        .catch(error => {
            console.error('删除异常', error);
            res.send({status: 1, msg: '删除异常, 请重新尝试'})
        })
});

// add product
router.post('/manage/product/add', (req, res) => {
    const product = req.body;
    ProductModel.create(product)
        .then(product => {
            res.send({status: 0, data: product})
        })
        .catch(error => {
            console.error('添加产品异常', error);
            res.send({status: 1, msg: 'Error when add product, please try again!'})
        })
});

// 获取产品分页列表
router.get('/manage/product/list', (req, res) => {
    const {pageNum, pageSize} = req.query;
    ProductModel.find({})
        .then(products => {
            res.send({status: 0, data: pageFilter(products, pageNum, pageSize)})
        })
        .catch(error => {
            console.error('获取商品列表异常', error);
            res.send({status: 1, msg: 'Error: '+error})
        })
});

// 搜索产品列表
router.get('/manage/product/search', (req, res) => {
    const {pageNum, pageSize, productName} = req.query;
    let contition = {name: new RegExp(`^.*${productName}.*$`)};
    ProductModel.find(contition)
        .then(products => {
            res.send({status: 0, data: pageFilter(products, pageNum, pageSize)})
        })
        .catch(error => {
            console.error('搜索商品列表异常', error);
            res.send({status: 1, msg: 'Search error, '+ error})
        })
});

// update product
router.post('/manage/product/update', (req, res) => {
    const product = req.body;
    ProductModel.findOneAndUpdate({_id: product._id}, product)
        .then(oldProduct => {
            res.send({status: 0})
        })
        .catch(error => {
            console.error('更新商品异常', error);
            res.send({status: 1, msg: 'Update product error, please try again!'})
        })
});

// update product status
router.post('/manage/product/updateStatus', (req, res) => {
    const {productId, status} = req.body;
    ProductModel.findOneAndUpdate({_id: productId}, {status})
        .then(() => {
            res.send({status: 0})
        })
        .catch(error => {
            console.error('更新产品状态异常', error);
            res.send({status: 1, msg: 'Update product error, please try again!'})
        })
});


function pageFilter(arr, pageNum, pageSize) {
    pageNum = pageNum * 1;
    pageSize = pageSize * 1;
    const total = arr.length;
    const pages = Math.floor((total + pageSize - 1) / pageSize);
    const start = pageSize * (pageNum - 1);
    const end = start + pageSize <= total ? start + pageSize : total;
    const list = [];
    for (var i = start; i < end; i++) {
        list.push(arr[i])
    }

    return {
        pageNum,
        total,
        pages,
        pageSize,
        list
    }
}

module.exports = router;