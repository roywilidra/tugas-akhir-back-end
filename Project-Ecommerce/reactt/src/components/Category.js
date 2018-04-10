import React,{Component} from 'react';
import axios from 'axios';

import {Link, Route} from 'react-router-dom';


class Category extends Component{
    constructor(){
        super();
        this.state = {
         category : [],
         season:[]
        
        }
      }     
 
      
componentDidMount(){
  //let temp = [];
  axios.get('http://localhost:3001/')
  .then((rep) =>
  {
  //   //console.log(res.data[0].id);
    
  //    // var season=res.data[1].id
  this.setState({season:rep.data})
  const idseason=this.state.season.map((x,index)=>{
  let param=x.id
      console.log(param)
      //console.log(typeof(s)) 
  

      return axios.get(`http://localhost:3001/category/${param}`)
        .then((res) =>
        {
         // temp.push(res.data)
          //console.log(res.data[0].category);
          this.setState({
            category:res.data
         })
        })
      })
      // console.log('isi temp',temp);
      
      // this.setState ({category: temp})
    })
  }
         render()
        {
        const satu=this.state.category.map((item,index)=>{
          let satu1=[item.category];
          let satu2=[item.idcategory];

          
          return <li key={satu2}><Link to="/Product">{satu1}</Link></li>
        })
  
        return (
          <div>
            
            <ul>
            {satu}
            </ul>
            
          </div>
        );
      }
  }
    


     

export default Category;