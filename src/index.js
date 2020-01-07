const express = require("express");
const serverless = require("serverless-http");
const calificaME = express();
const router = express.Router();
const bodyParser = require('body-parser');
const axios = require("axios");
const randomId = require('random-id');

calificaME.use(bodyParser.json());
calificaME.use(bodyParser.urlencoded({ extended: true }));

async function getData(url){
    try {
        var body = await axios({
            method: "get",
            url: url,
        });
        body = body.data;
    }catch (error) {
        body="error";
    }
    return body;
};

router.get("/publicaciones",(request,response)=>{
    getData('https://calificame-27d0f.firebaseio.com/calificaciones.json')
    .then(res =>{
        for (var key in res) {
            if (res.hasOwnProperty(key)) {
                var publicaciones = JSON.stringify(res[key]).replace(/\\/g,"").replace(/\{\"publicacion\":\"/g,"").replace(/\"\}\{\"publicacion\":\"/g,"").replace(/\"\}/g,"");
                response.write(publicaciones);
                response.end();
            }
        }
    });
});

router.get("/",(request,response)=>{
    getData('https://raw.githubusercontent.com/alexandro591/CalificaME/master/public/top.html')
    .then(res =>{
        response.write(res.toString());
        getData('https://calificame-27d0f.firebaseio.com/calificaciones.json')
        .then(res =>{
            for (var key in res) {
                if (res.hasOwnProperty(key)) {
                    var publicaciones = JSON.stringify(res[key]).replace(/\\/g,"").replace(/\{\"publicacion\":\"/g,"").replace(/\"\}\{\"publicacion\":\"/g,"").replace(/\"\}/g,"");
                    response.write(publicaciones);
                }
            }
            getData('https://raw.githubusercontent.com/alexandro591/CalificaME/master/public/bottom.html')
            .then(res =>{
                response.write(res.toString());
                response.end();
            });
        });
    });

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
    publicacion ='<div class="row"><div class="col-sm text-center"><h4>'+nombre+'<br></h4>'+universidad+'<br>'+materia+'</div><div class="col-sm text-center"><h5>'+frase+'<br></h5><p class="comment">'+comentario+'</p><p>'+calificacion+'/10</p><p>'+datetime.toISOString().slice(0,10)+'</p></div></div><hr>';
    var len = 10;
    var pattern = 'aA'
    var id = randomId(len,pattern)
    axios.post("https://calificame-27d0f.firebaseio.com/calificaciones/.json", {
        publicacion: publicacion
    });
    response.write("ok");
    response.end();
});

calificaME.use("/.netlify/functions/index",router);

module.exports.handler = serverless(calificaME);
