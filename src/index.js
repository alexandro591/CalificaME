const express = require('express');
const serverless = require('serverless-http');

const calificaME = express();
const router = express.Router();

router.get('/',(request,response)=>{

    response.end();
    
});

router.post('/',function(request,response){
});

calificaME.use('/.netlify/functions/index',router);

module.exports.handler = serverless(calificaME);
