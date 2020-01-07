const express = require("express");
const serverless = require("serverless-http");
const acolame = express();
const router = express.Router();
const bodyParser = require('body-parser');
const axios = require("axios");

var urlTopHTML = "https://raw.githubusercontent.com/acolame/acola.me/master/top.html";
var urlBottomHTML = "https://raw.githubusercontent.com/acolame/acola.me/master/bottom.html";
var urlDatabase = "https://acolame-d1d98.firebaseio.com/publicaciones.json"
acolame.use(bodyParser.json());
acolame.use(bodyParser.urlencoded({ extended: true }));

router.get("/",(request,response)=>{
    axios.get(urlTopHTML)
    .then(res=>{
        response.write(res.data.toString());
        axios.get(urlDatabase)
        .then(body=>{
            if(body.data!=null){
                var nItems = Object.keys(body.data).length;
                var posts=""
                for(let i=nItems-1;i>=0;i--){
                    id=Object.keys(body.data)[i].toString();
                    name=body.data[id.toString()].name.toString();
                    origin=body.data[id.toString()].origin.toString();
                    destination=body.data[id.toString()].destination.toString();
                    whatsapp=body.data[id.toString()].whatsapp.toString();
                    facebook=body.data[id.toString()].facebook.toString();
                    seats=body.data[id.toString()].seats.toString();
                    password=body.data[id.toString()].password.toString();
                    date=body.data[id.toString()].date.toString();
                    description=body.data[id.toString()].description.toString();
    
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0');
                    var yyyy = today.getFullYear();
    
                    today = mm + '/' + dd + '/' + yyyy;
                    today=today.toString();
                    posts='\
                    <li>\
                        <span class="exit" onclick="deletePost(\''+id+'\')"><i class="fa fa-times" aria-hidden="true"></i></span>\
                        <h3>'+name+'</h3>\
                        <p>Lugar de origen: <span class="origin">'+origin+'</span></p>\
                        <p>Lugar de destino: <span class="destination">'+destination+'</span></p>\
                        <p>Fecha: <span class="date-month timestamp">'+today+'</span></p>\
                        <p>Hora de salida: <span>'+date+'</span></p>\
                        <p>Asientos: <span>'+seats+'</span></p>\
                        <p>Redes sociales: <a href="https://wa.me/'+whatsapp+'"><i class="fa fa-facebook" aria-hidden="true"></i></a><a href="'+facebook+'"><i class="fa fa-whatsapp" aria-hidden="true"></i></a></p>\
                        <p class="comment">'+description+'\
                        </p>\
                    </li>'+posts
                    
                }
                axios.get(urlBottomHTML)
                .then(res=>{
                    response.write(posts.toString());
                    response.write(res.data.toString());
                    response.end();
                });
            }
            else{
                axios.get(urlBottomHTML)
                .then(res=>{
                    response.write(res.data.toString());
                    response.end();
                }); 
            }
            
        });
    });
    
});

router.post("/",function(request,response){
    let name = request.body.name;
    let origin = request.body.origin;
    let destination = request.body.destination;
    let whatsapp = request.body.whatsapp;
    let facebook = request.body.facebook;
    let seats = request.body.seats;
    let password = request.body.password;
    let date = request.body.date;
    let description = request.body.description;
    if(name!=="" && name!==null && origin!=="" && origin!==null && destination!=="" && destination!==null && whatsapp!=="" && whatsapp!==null && facebook!=="" && facebook!==null && seats!=="" && seats!==null && password!=="" && password!==null && date!=="" && date!==null && description!=="" && description!==null){
        axios.post("https://acolame-d1d98.firebaseio.com/publicaciones.json",{
            name:name,
            origin:origin,
            destination:destination,
            whatsapp:whatsapp,
            facebook:facebook,
            seats:seats,
            password:password,
            date:date,
            description:description
        })
        .then(()=>{
            response.write('ok')
            response.end();
        });
    }
    else{
        response.write('bad')
        response.end();
    }
});

router.post("/delete",function(request,response){
    let uri = request.body.uri;
    let key = request.body.key;
    axios.get("https://acolame-d1d98.firebaseio.com/publicaciones/"+uri+"/password.json")
    .then(res=>{
        console.log(res.data.toString())
        if(res.data.toString()===key.toString()){
            axios.delete("https://acolame-d1d98.firebaseio.com/publicaciones/"+uri+".json")
            .then(()=>{
                response.write("ok")
                response.end()
            });
        }
        else{
            response.write("bad")
            response.end()
        }
    });
});


acolame.use("/.netlify/functions/index",router);

module.exports.handler = serverless(acolame);

