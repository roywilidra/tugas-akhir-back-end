import React,{Component} from 'react';
import axios from 'axios';
import {Link, Route} from 'react-router-dom';


class Product extends Component{
    constructor(){
        super();
        this.state = {
         product : [],
         
        }
      }  
      
componentDidMount(){
  axios.get('http://localhost:3001/product')
  .then((res) =>
  {
    //console.log(res.data[0].id);
    
     // var season=res.data[1].id
    this.setState({
      product:res.data
     })
    })}

        render()
        {
        const satu=this.state.product.map((item,index)=>{
          let product=[item.product];
          let idproduct=[item.idproduct];
          let price=[item.price];
          let image=[item.productimage];
          

          
          // return <ul key={satu2} className="details">
          // <li><Link to="/Productdetail">{satu1}</Link></li>
          // <li><img src={`${satu4}`} alt={`${satu1}`} className="image"/></li>
          // <li>Rp. {satu3}</li>
          // </ul>
          return <div class="col-md-2 column productbox">
          <img src={`${image}`} class="img-responsive"/>
          <div class="producttitle">{product}</div>
          <div class="productprice"><div class="pull-right"><a href="#" class="btn btn-danger btn-sm" role="button"><Link to="/Productdetail">detail</Link></a></div><div class="pricetext">{price}</div></div>
      </div>
        })
  
        return (
          <div className="display">
            
            
            {satu}
            
            
          </div>
        );
      }
  }
    


     

export default Product;