const express = require("express");
const serverless = require("serverless-http");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const request = require('request');
const calificaME = express();
const router = express.Router();
const bodyParser = require('body-parser');

calificaME.use(bodyParser.json());
calificaME.use(bodyParser.urlencoded({ extended: true }));

var publicaciones='<div class="row">\
                    <div class="col-sm text-center">\
                        <h4>David Loza<br></h4>\
                        Universidad de las Fuerzas Armadas - ESPE<br>\
                        Intrumentación Mecánica\
                    </div>\
                    <div class="col-sm text-center">\
                        <h5>El mejor profe de la carrera<br></h5>\
                        <p class="comment">Excelente profesor, siempre dispuesto a ayudarte. Es exigente, pero no a un nivel exagerado. Actualmente es el director de la carrera</p>\
                        <p>10/10</p> \
                    </div>\
                    </div><hr>\
                    <div class="row">\
                    <div class="col-sm text-center">\
                        <h4>Wilbert Aguilar<br></h4>\
                        Universidad de las Fuerzas Armadas - ESPE<br>\
                        Redes Industriales\
                    </div>\
                    <div class="col-sm text-center">\
                        <h5>Innovador<br></h5>\
                        <p class="comment">Excelente docente, siempre dispuesto a ayudar al estudiante, amable y cordial</p>\
                        <p>10/10</p> \
                    </div>\
                    </div><hr>';
var htmlTextTop = '<html lang="en">\
<head>\
    <meta charset="UTF-8">\
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\
    <meta http-equiv="X-UA-Compatible" content="ie=edge">\
    <title>CalificaME</title>\
    <link rel="stylesheet" type="text/css" href="https://raw.githack.com/alexandro591/CalificaME/master/public/css/style.css">\
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>\
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>\
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">\
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>\
    <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">\
</head>\
<body>\
    <section id="mynavbar">\
        <nav class="navbar navbar-expand-lg">\
            <a class="navbar-brand" href=""><i class="fa fa-user-secret"></i></a>\
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"><i class="fa fa-expand"></i></button>\
            <div class="collapse navbar-collapse" id="navbarNav">\
                <ul class="navbar-nav ml-auto">\
                    <li class="nav-item ml-auto">\
                        <a class="nav-link" href="#home">Home</a>\
                    </li>\
                    <li class="nav-item ml-auto">\
                        <a class="nav-link" href="#posts">Comentarios</a>\
                    </li>\
                    <li class="nav-item ml-auto">\
                        <a class="nav-link" href="#send">Comenta!</a>\
                    </li>\
                </ul>\
            </div>\
          </nav>\
    </section>\
    \
    <section id="home">\
        <div class="about">\
            <h1>CalificaME</h1>\
            <p>Califica a tus profesores<br>con total confianza... 🤫</p>\
            <a href="#posts"><button style="color: white; margin-top: 10vh;" type="button" class="btn btn-outline-secondary" onclick="">Continua</button></a>\
        </div>\
    </section>\
    <section id="posts">\
        <div>\
            <div class="container">';
var htmlTextBottom = '\
            </div>\
                </div>    \
            <br><br><hr>\
            </section>\
            <section id="send">\
                <h4 style="color: white;">Envía una calificación</h4>\
                <div class="send">\
                    <textarea class="nombre" id="input" placeholder="Nombre del profesor" rows="1"></textarea><br><br>\
                    <textarea class="universidad" id="input" placeholder="Universidad" rows="1"></textarea><br><br>\
                    <textarea class="materia" id="input" placeholder="Materia" rows="1"></textarea><br><br>\
                    <textarea class="frase" id="input" placeholder="Descríbelo en una frase" rows="1"></textarea><br><br>\
                    <textarea class="comentario" id="input" placeholder="Descríbelo con más detalle" style="height: 30%;"></textarea><br><br>\
                    <div class="dropdown">\
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Califica</button>\
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">\
                            <a class="dropdown-item" onclick="califica(1)">1</a>\
                            <a class="dropdown-item" onclick="califica(2)">2</a>\
                            <a class="dropdown-item" onclick="califica(3)">3</a>\
                            <a class="dropdown-item" onclick="califica(4)">4</a>\
                            <a class="dropdown-item" onclick="califica(5)">5</a>\
                            <a class="dropdown-item" onclick="califica(6)">6</a>\
                            <a class="dropdown-item" onclick="califica(7)">7</a>\
                            <a class="dropdown-item" onclick="califica(8)">8</a>\
                            <a class="dropdown-item" onclick="califica(9)">9</a>\
                            <a class="dropdown-item" onclick="califica(10)">10</a>\
                        </div><span id="nota" style="color: white;"><b>Selecciona</b></span>\
                    </div><br>\
                    <input class="btn btn-primary" type="submit" value="Enviar" onclick="send()">\
                </div>\
            </section>\
        </body>\
        </html>\
        <script>\
            var calificacion=0;\
            try {\
                $(document).click(function(){\
                    $(".navbar-collapse").collapse("hide");\
                });\
            } catch (error) {\
                console.log(error)\
            }\
            function califica(n){\
                $("#nota").html("<u>Nota: "+n+"</u>");\
                calificacion=n;\
            }\
            function send(){\
                if(calificacion===0 || document.getElementsByClassName("nombre")[0].value=="" || document.getElementsByClassName("universidad")[0].value=="" || document.getElementsByClassName("materia")[0].value=="" || document.getElementsByClassName("frase")[0].value=="" || document.getElementsByClassName("comentario")[0].value==""){\
                    window.alert("Por favor, llena todos los parámetros");\
                }\
                else{\
                    $.post("https://calificame.netlify.com/.netlify/functions/index",{\
                        nombre: document.getElementsByClassName("nombre")[0].value,\
                        universidad: document.getElementsByClassName("universidad")[0].value,\
                        materia: document.getElementsByClassName("materia")[0].value,\
                        frase: document.getElementsByClassName("frase")[0].value,\
                        comentario: document.getElementsByClassName("comentario")[0].value,\
                        calificacion: calificacion\
                    },\
                    function(data, status, xhr) {\
                    },"json");\
                    window.alert("Enviaste una calificación de: "+calificacion);\
                    location.reload();\
                }\
            }\
        </script>';

var htmlText;

router.get("/resetdepublicaciones",(request,response)=>{
    publicaciones='<div class="row">\
                    <div class="col-sm text-center">\
                        <h4>David Loza<br></h4>\
                        Universidad de las Fuerzas Armadas - ESPE<br>\
                        Intrumentación Mecánica\
                    </div>\
                    <div class="col-sm text-center">\
                        <h5>El mejor profe de la carrera<br></h5>\
                        <p class="comment">Excelente profesor, siempre dispuesto a ayudarte. Es exigente, pero no a un nivel exagerado. Actualmente es el director de la carrera</p>\
                        <p>10/10</p> \
                    </div>\
                    </div><hr>\
                    <div class="row">\
                    <div class="col-sm text-center">\
                        <h4>Wilbert Aguilar<br></h4>\
                        Universidad de las Fuerzas Armadas - ESPE<br>\
                        Redes Industriales\
                    </div>\
                    <div class="col-sm text-center">\
                        <h5>Innovador<br></h5>\
                        <p class="comment">Excelente docente, siempre dispuesto a ayudar al estudiante, amable y cordial</p>\
                        <p>10/10</p> \
                    </div>\
                    </div><hr>';
    response.write("Publicaciones reseteadas")
    response.end();
});

router.get("/publicaciones",(request,response)=>{
    response.write(publicaciones)
    response.end();
});

router.get("/",(request,response)=>{
    htmlText = htmlTextTop+publicaciones+htmlTextBottom
    response.write(htmlText)
    response.end();
});

router.post("/",function(request,response){
    let nombre = request.body.nombre;
    let universidad = request.body.universidad;
    let materia = request.body.materia;
    let frase = request.body.frase;
    let comentario = request.body.comentario;
    let calificacion = request.body.calificacion;
    comentario = comentario.replace(/\n/g,"<br>")
    publicaciones='<div class="row">\
    <div class="col-sm text-center">\
        <h4>'+nombre+'<br></h4>\
        '+universidad+'<br>\
        '+materia+'\
    </div>\
    <div class="col-sm text-center">\
        <h5>'+frase+'<br></h5>\
        <p class="comment">'+comentario+'</p>\
        <p>'+calificacion+'/10</p>\
    </div>\
    </div><hr>'+publicaciones;
    response.write("ok");
    response.end();
});

calificaME.use("/.netlify/functions/index",router);

module.exports.handler = serverless(calificaME);
