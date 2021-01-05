/*to store and manage local data*/
const USER_KEY = 'user_key';
const saveUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
};
const getUser = () => JSON.parse(localStorage.getItem(USER_KEY)||'{}');
const  removeUser = () => {
    localStorage.removeItem(USER_KEY)
};
const storageUtils = {saveUser,getUser,removeUser}
export default storageUtils