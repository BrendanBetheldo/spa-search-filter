import React, { Component } from 'react'
import './HeroBanner.scss'



class HeroBanner extends Component {   

    scrollToBottom = () => {
        const filterComp = document.getElementsByClassName('field-filter-component');
        window.scrollTo({
            top: filterComp[0].offsetTop,
            behavior: 'smooth'
        });
    }

    render () {
        return (        
            <div className="hero-banner-container">                
                <div className="image-container">           
                    <div className="top-right-copy"><span>SPACE SAVVY</span></div>
                    <div className="row justify-content-center">
                        <div className="hero-copy"><h1>Discover Space Missions</h1></div>
                    </div>
                    <span className="chevron-down" onClick={this.scrollToBottom}></span>
                </div>                
            </div>              
           
        )
    }
      
}

export default HeroBanner