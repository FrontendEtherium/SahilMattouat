import React, { Component } from 'react';

import Header from "./Header";
import Footer from '../Footer/Footer';

export default class Disclaimer extends Component{
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
            articleFilter: 'recent',
            mail:'info@etheriumtech.com'
          };
        }
          render(){
            var { isLoaded, items, regionPostsLoaded, LoadMore } = this.state;
    return(
<>
<div>
<Header history={this.props.history}/>
<div className="container mt-8">
    <h3>Medical Disclaimer</h3>
    <p className='mt-3'> Content available on All Cures website is not intended to be a substitute for
     professional medical advice, diagnosis, or treatment. It is strongly recommended to consult your physician
      or other qualified medical practitioner with any questions you may have regarding a medical condition. 
      The website should not be used as a source for treatment of any medical condition.
         
         </p>
       

          
</div><br/>
<div className="container my-4">
    <h3>Contact Us</h3>
<h5 className='mt-3' style={{textTransform:"none"}} >Email id: <a href="mailto:info@etheriumtech.com">{this.state.mail.toLowerCase()}</a></h5>
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
