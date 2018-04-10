import React,{Component} from 'react';
import axios from 'axios';
import './Productdetail.css'
import {Link, Route} from 'react-router-dom';


class Productdetail extends Component{
    constructor(){
        super();
        this.state = {
         productdetail : [],
         
        }
      }        
          
        
      
componentDidMount(){

  axios.get('http://localhost:3001/productdetail')
  .then((res) =>
  {
    console.log(res.data);
    
     // var season=res.data[1].id
    this.setState({
      productdetail:res.data
     })
    })}

        render()
        {
        const satu=this.state.productdetail.map((item,index)=>{
          let color=[item.color];
          let idsize=[item.idsize];
          let idproduct=[item.idproduct]
          let size=[item.size];
          let stock=[item.stock];
          let product=[item.product];
          let price=[item.price]
          let image=[item.productimage]
          
        
          // <ul key={idsize} className="details">
          // <li>{product}</li>
          // <li><img src={image} className="image"/></li>
          // <li>Rp. {price}</li>
          // <li>{color}</li>
          // <li>{size}</li>
          // <li>{stock}</li>
          // <li><button type="submit" key={idsize}>cart</button></li>
          // </ul>
        	return <div class="container">
		<div class="card">
			<div class="container-fliud">
				<div class="wrapper row">
					<div class="preview col-md-6">
						
						<div class="preview-pic tab-content">
						 
						  <div class="tab-pane" id={idproduct}><img src={`${image}`}/></div>
						</div>
						<ul class="preview-thumbnail nav nav-tabs">
						  <li><a data-target={idproduct} data-toggle="tab"><img src={`${image}`}/></a></li>
						</ul>
						
					</div>
					<div class="details col-md-6">
						<h3 class="product-title">{product}</h3>
						<div class="rating">
							<div class="stars">
								<span class="fa fa-star checked"></span>
								<span class="fa fa-star checked"></span>
								<span class="fa fa-star checked"></span>
								<span class="fa fa-star"></span>
								<span class="fa fa-star"></span>
							</div>
							<span class="review-no">41 reviews</span>
						</div>
						<p class="product-description">Suspendisse quos? Tempus cras iure temporibus? Eu laudantium cubilia sem sem! Repudiandae et! Massa senectus enim minim sociosqu delectus posuere.</p>
						<h4 class="price">current price: <span>{price}</span></h4>
						<p class="vote"><strong>91%</strong> of buyers enjoyed this product! <strong>(87 votes)</strong></p>
						<h5 class="sizes">sizes:
							<span class="size" data-toggle="tooltip" title={size}>{size}</span>
						</h5>
						<h5 class="colors">colors:
							<span class="color">{color}</span>
						</h5>
						<div class="action">
							<button class="add-to-cart btn btn-default" type="button">add to cart</button>
							
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
        })
  
        return (
          <div className="display">
            
            
            {satu}
            
            
          </div>
        );
      }
  }
    


     

export default Productdetail;