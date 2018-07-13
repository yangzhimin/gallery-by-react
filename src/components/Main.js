require('normalize.css/normalize.css');
require('styles/App.css');
require('styles/test.scss');
import React from 'react';
import ReactDOM from 'react-dom';

let yeomanImage = require('../images/yeoman.png');
let imageData=require('../data/imageData.json');
imageData=imageData.map((item)=>{
	item.imageUrl=require('../images/'+item.fileName);
	return item;
})

class ImgFigure extends React.Component{
  handleClick(e){
    e.stopPropagation();
    e.preventDefault();
    this.props.center()
    
  }
  render(){
    var styleObj={};
    if(!!this.props.range){
      styleObj=this.props.range.pos;
      styleObj.transform = 'rotate('+this.props.range.rotate+'deg)';
      if(this.props.range.isCenter){
        styleObj.zIndex = '11';
      }
    }
    let className="img-figure";
    className+=this.props.isInverse?" inverse":"";
    
    return(
      <figure className={className} style={styleObj} onClick={this.handleClick.bind(this)}>
        <div className="img-front">
            <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
            <figcaption>
              <h2 className="img-title">{this.props.data.title}</h2>

            </figcaption>
        </div>
        
        <div className="img-back">
            <p>
                {this.props.data.desc}
            </p>
          </div>
      </figure>
    )
  }
}

class AppComponent extends React.Component {
  constructor(props){
    super(props);
    this.state={
      imgArr:[]
    }
    this.Constant={
      centerPos:{
        top:0,
        left:0
      },
      hPosRange:{
        leftSecX:[0,0],
        rightSecX:[0,0],
        y:[0,0]
      },
      vPosRange:{
        x:[0,0],
        topSecY:[0,0]
      }
    }
  };
  
  recenter(index){
    return function(){
    
      this.rearrange(index);
    }.bind(this);
  };

  getRangeRandom(low,high){
    return Math.floor(Math.random()*((high-low))+low)
  }
  getRotateRandom(){
   
    return ((Math.random()>0.5?"":"-")+(Math.random()*30));
  }
  rearrange(centerIndex){
      let imgArr=this.state.imgArr,
          Constant=this.Constant,
          centerPos=Constant.centerPos,
          hPosRange=Constant.hPosRange,
          vPosRange=Constant.vPosRange,
          leftSecX=hPosRange.leftSecX,
          rightSecX=hPosRange.rightSecX,
          y=hPosRange.y,
          x=vPosRange.x,
          topSecY=vPosRange.topSecY,        
          topImgNum=Math.floor(Math.random()*2),
          centerImg=imgArr.splice(centerIndex,1),
          topImgIndex=0,
          topImgArr=[];
      centerImg[0].pos.top=centerPos.top;//中间位置
      centerImg[0].pos.left=centerPos.left;//中间位置
      centerImg[0].rotate=0;
      centerImg[0].isCenter=true;
      topImgIndex=topImgNum==0?-1:Math.floor(Math.random()*imgArr.length);
      topImgArr=imgArr.splice(topImgIndex,topImgNum);
      topImgArr.forEach(function(item){//上区域位置
          item.pos.left=this.getRangeRandom(x[0],x[1]);
          item.pos.top=this.getRangeRandom(topSecY[0],topSecY[1]);
          item.rotate=this.getRotateRandom();
          item.isCenter=false;
      }.bind(this));
      for(let i=0,l=imgArr.length,k=l/2;i<l;i++){
        let item=imgArr[i];
        if(i<k){
          item.pos.left=this.getRangeRandom(leftSecX[0],leftSecX[1]);

        }else{
          item.pos.left=this.getRangeRandom(rightSecX[0],rightSecX[1]);
        }
        item.pos.top=this.getRangeRandom(y[0],y[1]);
        item.rotate=this.getRotateRandom();
        item.isCenter=false;
      }
      imgArr.splice(centerIndex,0,centerImg[0]);
      topImgArr.unshift(topImgIndex,0);
      console.log(imgArr)
      Array.prototype.splice.apply(imgArr,topImgArr);
      this.setState({
        imgArr
      })

  }
  componentDidMount(){
    let stageDom=ReactDOM.findDOMNode(this.refs.stage),
        stageW=stageDom.scrollWidth,
        stageH=stageDom.scrollHeight,
        halfStageW=Math.ceil(stageW/2),
        halfStageH=Math.ceil(stageH/2);
    let figureDom=ReactDOM.findDOMNode(this.refs.figure0),
        figureW=figureDom.scrollWidth,
        figureH=figureDom.scrollHeight,
        halfFigureW=Math.ceil(figureW/2),
        halfFigureH=Math.ceil(figureH/2);
    this.Constant.centerPos.left=halfStageW-halfFigureW;
    this.Constant.centerPos.top=halfStageH-halfFigureH;
    this.Constant.hPosRange.leftSecX[0]=-halfFigureW;
    this.Constant.hPosRange.leftSecX[1]=halfStageW-halfFigureW*3;
    this.Constant.hPosRange.rightSecX[1]=stageW-halfFigureW;
    this.Constant.hPosRange.rightSecX[0]=halfStageW+halfFigureW;
    this.Constant.hPosRange.y[0]=-halfFigureH;
    this.Constant.hPosRange.y[1]=stageH-halfFigureH;
    this.Constant.vPosRange.x[0]=halfStageW-figureW;
    this.Constant.vPosRange.x[1]=halfStageW;
    this.Constant.vPosRange.topSecY[0]=-halfFigureH;
    this.Constant.vPosRange.topSecY[1]=halfStageH-halfFigureH*3;
this.rearrange(0);
    
    
  } 
  render() {
    var imgFigures=[];
    var imgArr=this.state.imgArr;
   
   
    
   
    imageData.forEach(function(item,index){    
      if(!imgArr[index]) {
        imgArr[index]={
          pos:{
            top:0,
            left:0
          },
          rotate:0,
          isInverse:false,
          isCenter:false
        } 
      }
      
      imgFigures.push(<ImgFigure center={this.recenter(index).bind(this)} range={imgArr[index]} key={index} data={item} ref={"figure"+index}/>)
    }.bind(this))
    return (
      <div className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
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
