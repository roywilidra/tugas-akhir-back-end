import React, { Component } from 'react';
import axios from 'axios';
import {Redirect,Link, Route} from 'react-router-dom';
// import Userlogin from "./components/Userlogin"
// import Userreg from "./components/Userreg"
// import Navbar from "./components/Navbar"
import Season from "./components/Season"
// import Category from "./components/Category"
// import Product from "./components/Product"
// import Productdetail from "./components/Productdetail"
class App extends Component {
  render(){
    return(
      <div>
        {/* <Navbar/> */}
        <Route path='/' render={() => <Redirect to='/home'/>}/>
        {/* <Route path='/userlogin' component={Userlogin}/> */}
        <Route path='/home' component={Season}/>
        {/*<Route path='/Season' component={Season}/>*/}
        {/* <Route path='/category' component={Category}/>
        <Route path='/userreg' component={Userreg}/>
        
        <Route path='/Product' component={Product}/>
        <Route path='/Productdetail' component={Productdetail}/> */}
        </div>
        
    )}
  }
export default App;