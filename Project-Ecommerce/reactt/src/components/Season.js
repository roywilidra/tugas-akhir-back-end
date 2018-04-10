import React,{Component} from 'react';
import axios from 'axios';
import {Link, Route} from 'react-router-dom';


class Season extends Component{
    constructor(){
        super();
        this.state = {
         season : []
        }
      }
    componentDidMount(){
        axios.get('http://localhost:3001/')
        .then((res) =>
        {
          //console.log(res.data);
          this.setState({
            season:res.data
          })
        })
      }
        render()
        {
        const satu=this.state.season.map((item,index)=>{
          let satu1=[item.Season_Name];
          let satu2=[item.Id_Season];

          
          return <li key={satu2}><Link to={`category/${satu2}`}>{satu1}</Link></li>
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
    


     

export default Season;