const express = require("express");
const serverless = require("serverless-http");
const calificaME = express();
const router = express.Router();
const bodyParser = require('body-parser');
const axios = require("axios");

calificaME.use(bodyParser.json());
calificaME.use(bodyParser.urlencoded({ extended: true }));

//function to get body from url
var publicaciones;


router.get("/resetdepublicaciones",(request,response)=>{
    response.end();
});

router.get("/publicaciones",(request,response)=>{
    response.write(publicaciones)
    response.end();
});

router.get("/",(request,response)=>{
    var url = "https://raw.githubusercontent.com/alexandro591/CalificaME/master/public/index.html";
    var getData = async url => {
        try {
            var body = await axios.get(url);
            body = body.data;
        }catch (error) {
            body="error";
        }
        return body;
    };
    getData(url).then((res=>{
        s=res.toString()
        console.log(s)
        response.write(s);
        response.end();
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
