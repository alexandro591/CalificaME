const express = require("express");
const serverless = require("serverless-http");
const calificaME = express();
const router = express.Router();
const bodyParser = require('body-parser');
const axios = require("axios");

calificaME.use(bodyParser.json());
calificaME.use(bodyParser.urlencoded({ extended: true }));

//function to get body from url
async function getData(url){
    try {
        var body = await axios.get(url);
        body = body.data.toString();
    }catch (error) {
        body="error";
    }
    return body;
};


var publicaciones="";
const htmlUrlTop = "https://raw.githubusercontent.com/alexandro591/CalificaME/master/public/top.html";
const htmlUrlPublicaciones = "https://raw.githubusercontent.com/alexandro591/CalificaME/master/public/publicaciones.html";
const htmlUrlBottom = "https://raw.githubusercontent.com/alexandro591/CalificaME/master/public/bottom.html";


router.get("/resetdepublicaciones",(request,response)=>{
    getData(htmlUrlPublicaciones).then((res=>{
        response.write(publicaciones);
        response.write(res);
        response.end();
    }));
});

router.get("/publicaciones",(request,response)=>{
    response.write(publicaciones)
    response.end();
});

router.get("/",(request,response)=>{
    getData(htmlUrlTop).then((res=>{
        response.write(res);
        getData(htmlUrlPublicaciones).then((res=>{
            response.write(res);
            getData(htmlUrlBottom).then((res=>{
                response.write(res);
                response.end()
            }));
        }));
    }));
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
    publicaciones ='<div class="row">\
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
                    </div><hr>'+publicaciones;
    response.write("ok");
    response.end();
});

calificaME.use("/.netlify/functions/index",router);

module.exports.handler = serverless(calificaME);
