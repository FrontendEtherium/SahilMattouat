import React, { Component } from 'react';
import axios from "axios";
import { backendHost } from "../../api-config";
import Header from "./Header";
import Footer from '../Footer/Footer';

export default class Editorial extends Component{
    constructor(props) {
        super(props);
        const params = props.match.params
        this.state = { 
            limit: 15,
            offset: 0,
            dc: props.location.search.split('&')[1],
            noMoreArticles: false,
            param: params,
            items: [],
            isLoaded: false,
            LoadMore: false,
            regionPostsLoaded: false,
            country: new URLSearchParams(this.props.location.search).get('c'),
            diseaseCondition: new URLSearchParams(this.props.location.search).get('dc'),
            articleFilter: 'recent'
          };
        }
          render(){
            var { isLoaded, items, regionPostsLoaded, LoadMore } = this.state;
    return(
<>
<div>
<Header history={this.props.history}/>
<div className="container mt-8">
    <h3>Source Disclaimer</h3>
    <p className='mt-3'>The material and content available in this article has been compiled and written by the Editorial team of All-Cures.
     The editorial team at All-Cures makes every effort to make sure that the information provided in the article is accurate, correct and 
     complete and does not contain any part that is either misleading or incomplete. The details in the articles are for the purpose of information only and should not be seen as a substitute for medical advise.
         
         </p>
       

          
</div><br/>
<div className="container my-4">
    <h3>Contact Us</h3>
<h5 className='mt-3' style={{textTransform:"none"}}>Email id: <a href="mailto:info@etheriumtech.com">info@etheriumtech.com</a></h5>
<h5>Phone No.: <a href="tel:0091 191 295 9035">0091 191 295 9035</a></h5>
<div class="container my-10"><h3><a href="/feedback"><button id=""
          className="article-search btn btn-dark mt-10">Submit Your Feedback</button></a></h3></div>
          
</div>
<Footer></Footer>
</div>
</>
    );

}
}
