const express = require("express");
const serverless = require("serverless-http");
const calificaME = express();
const router = express.Router();
const bodyParser = require('body-parser');
const axios = require("axios");

var fs = require('fs');

calificaME.use(bodyParser.json());
calificaME.use(bodyParser.urlencoded({ extended: true }));

/*function to get body from url
async function getData(url){
    try {
        var body = await axios.get(url);
        body = body.data.toString();
    }catch (error) {
        body="error";
    }
    return body;
};
*/

router.get("/resetdepublicaciones",(request,response)=>{
});

router.get("/publicaciones",(request,response)=>{
    fs.readFile('public/publicaciones.html', function(err, data) {
        response.write(data);
        response.end();
    });
});

router.get("/",(request,response)=>{
    let top="";
    let publicaciones="";
    let bottom="";
    fs.readFile('public/top.html', function(err, data) {
        top=data.toString();
        fs.readFile('public/publicaciones.html', function(err, data) {
            publicaciones=data.toString();
            fs.readFile('public/bottom.html', function(err, data) {
                bottom=data.toString();
                response.write(top+publicaciones+bottom);
                response.end();
            });
        });
    })

});

router.post("/",function(request,response){
    let nombre = request.body.nombre;
    let universidad = request.body.universidad;
    let materia = request.body.materia;
    let frase = request.body.frase;
    let comentario = request.body.comentario;
    let calificacion = request.body.calificacion;
    var datetime = new Date();
    comentario = comentario.replace(/\n/g,"<br>");
    publicacion ='<div class="row">\
                        <div class="col-sm text-center">\
                            <h4>'+nombre+'<br></h4>\
                            '+universidad+'<br>\
                            '+materia+'\
                        </div>\
                        <div class="col-sm text-center">\
                            <h5>'+frase+'<br></h5>\
                            <p class="comment">'+comentario+'</p>\
                            <p>'+calificacion+'/10</p>\
                            <p>Date:'+datetime.toISOString().slice(0,10)+'</p>\
                        </div>\
                    </div><hr>';
    var fd = fs.openSync('public/publicaciones.html', 'a+');
    fs.write(fd, publicacion, 0, publicacion.length, 0);
    response.write("ok");
    response.end();
});

calificaME.use("/.netlify/functions/index",router);

module.exports.handler = serverless(calificaME);
