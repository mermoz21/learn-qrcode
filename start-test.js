//==== composant:app_expressjs====
var express = require('express');
var path = require('path');
var parser=require("body-parser");

var app = express();
app.use(express.static(path.resolve(__dirname,'client')));
app.post('/qrcode',parser.urlencoded(),myfn);

function myfn(req,res){
  console.log(req.body);
  var image_svg=/*connecteur: image_svg*/ generate_qrcode(req.body.code,'svg');
  res.type('svg');
  image_svg.pipe(res);
}
//=======================

//==== composant:Serveur_HTTP ====
function Serveur_HTTP()
{
  var http = require('http');
  this.start=function start(app)
  {
    var server = http.createServer(/*connecteur:request_listner*/app);
    
    server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
      var addr = server.address();
      console.log("HTTP Server listening at", addr.address + ":" + addr.port);
    });
  };
}
new Serveur_HTTP().start(app);
//=======================

//==== composant:generateur_qrcode ====
var qr=require("qr-image");

function generate_qrcode(code,format,level,scale,margin){
  return qr.image(code,{ec_level:level||'Q', size:scale||'2',type:format||'svg',margin:margin||4});
}
//=======================
