//==== Classe Connecteur ====
function connector(){
  this.push=push;
  this.pull=pull;
  this.call=call;
  this.connect=connect;
  this.callback=undefined;
  this.value=undefined;
  
  function push(value){
    
    if (value!=undefined) {
      this.value=value;
    } 
      
    if ((this.callback!=undefined)&&(this.value!=undefined))  this.callback(this.value);
  }
  
  function pull(){
    var value=undefined;
    
    return value;
  }
  
  function call(value){
    return this.callback(value);
  }
  
  function connect(callback){
    this.callback=callback;
    if (this.value!=undefined) {this.push()};
  }
  
  function unconnect(){
    this.callback=undefined;
  }
}
//=======================

//==== composant:app_expressjs====
function app_expressjs(){
  var express = require('express');
  var path = require('path');
  var parser=require("body-parser");
  
  this.app=new connector();
  this.get_qrcode=new connector();
  
  var app = express();
  app.use(express.static(path.resolve(__dirname,'client')));
  app.post('/qrcode',parser.urlencoded(),myfn.bind(this));
  this.app.push(app);
  
  function myfn(req,res){
    //console.log(req.body);
    var image_svg=this.get_qrcode.call({code:req.body.code,format:'svg'});
    res.type('svg');
    image_svg.pipe(res);
  }
}
//=======================

//==== composant:Serveur_HTTP ====
function Serveur_HTTP()
{
  var http = require('http');
  this.start=function (app)
  {
    var server = http.createServer(/*connecteur:request_listner*/app);
    
    server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
      var addr = server.address();
      console.log("HTTP Server listening at", addr.address + ":" + addr.port);
    });
  };
}

//=======================

var appjs=new app_expressjs();
appjs.app.connect(new Serveur_HTTP().start);
appjs.get_qrcode.connect(function (value){return generate_qrcode(value.code,value.format)});

var t='string';
console.log(t);
//==== composant:generateur_qrcode ====
var qr=require("qr-image");

function generate_qrcode(code,format,level,scale,margin){
  return qr.image(code,{ec_level:level||'Q', size:scale||'2',type:format||'svg',margin:margin||4});
}
//=======================
