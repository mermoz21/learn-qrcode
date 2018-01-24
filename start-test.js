var connector=require('connecteur.js');

//==== composant:app_expressjs====
function app_expressjs(){
  var express = require('express');
  var path = require('path');
  var parser=require("body-parser");
  
  this.app=new connector();
  this.get_qrcode=new connector();
  
  var app = express();
  console.log("APP Express :",app);
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

//==== composant:generateur_qrcode ====
var qr=require("qr-image");

function generate_qrcode(code,format,level,scale,margin){
  return qr.image(code,{ec_level:level||'Q', size:scale||'2',type:format||'svg',margin:margin||4});
}
//=======================
