require('normalize.css/normalize.css');
require('styles/App.css');
require('styles/test.scss');
import React from 'react';

let yeomanImage = require('../images/yeoman.png');
let imageData=require('../data/imageData.json');
imageData=imageData.map((item)=>{
	item.imageUrl=require('../images/'+item.fileName);
	return item;
})

class AppComponent extends React.Component {
  render() {
    return (
      <div className="stage">
        <section className="img-sec">
        </section>
        <nav className="imag-nav">
        </nav>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
