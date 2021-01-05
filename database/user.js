/*The model to operate user database*/
const mongoose = require('mongoose');
const md5 = require('blueimp-md5'); //To encrypt password
const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    phone: String,
    email: String,
    create_time: {type: Number, default: Date.now},
    role_id: String
});
const UserModel = mongoose.model('users', userSchema);
UserModel.findOne({username: 'admin'}).then(user => {
    if(!user) {
        UserModel.create({username: 'admin', password: md5('admin')})
            .then(user => {
                console.log('initial user: username: admin password: admin')
            })
    }
});
/*userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v
    }
});*/
module.exports = UserModel;