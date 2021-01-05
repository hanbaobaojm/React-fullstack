import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'
import ProductDetails from "./ProductDetails";
import ProductHome from "./ProductHome";
import AddUpdate from "./Add-Update";
import './product.css'
const Product = () => {
    return(
        <Switch>
            <Route path='/product/detail' component={ProductDetails}/>
            <Route path='/product/addupdate' component={AddUpdate}/>
            <Route path='/product' component={ProductHome} exact/>
            <Redirect to='/product' />
        </Switch>
    )
}
export default Product