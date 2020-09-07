const express = require('express');
const session = require('express-session')
const app = express();

const bodyParser = require('body-parser');
const request = require('request');
const path = require(`path`);
const crypto = require('crypto');
const fs = require('fs');
const base64img = require('base64-img');
const { totalmem } = require('os');
const { resolve } = require('path');

var handlebars = require('express-handlebars').create({defaultLayout:'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    'eq': function () {
      const args = Array.prototype.slice.call(arguments, 0, -1);
      return args.every(function (expression) {
          return args[0] === expression; });
    },
    'lookup_prop': function(){
      const args = Array.prototype.slice.call(arguments, 0, -1);
        for (key in args[1]){
          if (args[0] === key){
            return args[1][args[0]];
          }
        }    
      return "";
    }
  }
});


app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
// Define css path 
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');

const buf = Buffer.alloc(10);
const USERCRYPTO = crypto.randomFillSync(buf).toString('hex');

app.use(session({
  secret: `${USERCRYPTO}`,
  resave: true,
  saveUninitialized: true
}))

const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

/* ----- Read in static JSON file of all descriptions ---- */

function initialize_context(){
  return new Promise(function(resolve,reject) {
    fs.readFile('./public/descriptions.json', (err, data) => {
      if (err) throw err;
      var descriptions = JSON.parse(data);
      resolve(descriptions);
    });
  });
}

/* ------------- Begin Controller Functions ------------- */

//Results page
router.get('/results', (req, res) => {
  const NUM_TESTS = 8;
  var context = {};
  initialize_context().then(function(descriptions) {
        //intialize context
        context = descriptions;

        if(req.session.result_ipip != undefined){
          context.ipipResult.result = req.session.result_ipip.toString();
          context.ipipResult.details = req.session.details_ipip;
        }
        if(req.session.result_jt != undefined){
          context.jtResult.result = req.session.result_jt.toString();
          context.jtResult.details = req.session.details_jt;
        }
        if(req.session.result_disc != undefined){
          context.discResult.result = req.session.result_disc.toString();
          context.discResult.details = req.session.details_disc;
        }
        if(req.session.result_fpq != undefined){
          context.fpqResult.result = req.session.result_fpq.toString();
          context.fpqResult.details = req.session.details_fpq;
        }
        if(req.session.result_eq != undefined){
          context.eqResult.result = req.session.result_eq.toString();
          context.eqResult.details = req.session.details_eq;
        }
        if(req.session.result_eops != undefined){
          context.eopsResult.result = req.session.result_eops.toString();
        }   
        if(req.session.result_chrono != undefined){
          context.chronoResult.result = req.session.result_chrono.toString();
        }
        if(req.session.result_spirit != undefined){
          context.spiritResult.result = req.session.result_spirit.toString();
        }
        if(req.session.dnd_char != undefined){
          context.dndChar = req.session.dnd_char.toString();
          var url_static = './public/img/' + req.session.dnd_char.toString() +  '.jpg';     
          context.imgURL = base64img.base64Sync(url_static); 
        }
      
        if (req.session.display_check === '1'){
          context.dndCharDisplay = '1';
        }
        else{
          context.dndCharDisplay = '0';
        }
        //check if all tests completed
        var all_defined = 1;
        var all_results = {};
        var idx = 0;
        for (result_string in context){
          if(context[result_string].result == ""){
            all_defined = 0;
            all_results[idx] = "";
          }
          else{
            all_results[idx] = context[result_string].result;
          }
          if (idx < (NUM_TESTS - 1)){
            idx++;
          }
        }
        if (all_defined == 1 && req.query.reprocess != 'custom'){
          context.animate = '1';
          context.dndCharDisplay = '1';
          //Generate random processing id for current user's dnd character recalculation
          var rand = Math.floor(Math.random() * 100);
          rand *= (Math.floor(Math.random() * 5) + 1);
          const proto = req.protocol + '://' + req.get('host'); 
          var options = { method: 'POST',
            url: `${proto}/custom/results/${rand}`,
            headers: { 'content-type': 'application/json' },
            body: all_results,
            json: true };
          request(options, (error, response, body) => {
              if (error){
                  res.status(500).send(error);
              } else {
                res.render('results.handlebars', context);
              }
          });
        }
        else{
          context.animate = '0';
          res.render('results.handlebars', context);
        }
      


  }, function(error) {
      console.error("Failed!", error);
      //intialize placeholder context if failed read
      var context = {
          "ipipResult" : {
              "result": "",
              "details": ""
        },
          "jtResult" :  {
            "result": "",
            "details": ""
        },
          "discResult" :  {
            "result": "",
            "details": ""
        },
          "fpqResult" :  {
            "result": "",
            "details": ""
        },
          "eqResult" :  {
            "result": "",
            "details": ""
        },
          "eopsResult" :  {
            "result": ""
        },
          "chronoResult" :  {
            "result": ""
        },
          "spiritResult":  {
            "result": ""
        }
      }
      res.render('results.handlebars', context);
  });
  
});

//Home page
router.get('/', (req, res) => {
  res.render('home.handlebars');
});


/* ------------- End Controller Functions ------------- */

app.use('/', router);
app.use('/ipipTest', require('./ipipTest.js'));
app.use('/jtTest', require('./jtTest.js'));
app.use('/discTest', require('./discTest.js'));
app.use('/fpqTest', require('./fpqTest.js'));
app.use('/eqTest', require('./eqTest.js'));
app.use('/eopsTest', require('./eopsTest.js'));
app.use('/chronoTest', require('./chronoTest.js'));
app.use('/spiritTest', require('./spiritTest.js'));
app.use('/custom', require('./custom.js'));

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
