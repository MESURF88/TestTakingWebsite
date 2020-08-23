const express = require('express');
const session = require('express-session')
const app = express();

const bodyParser = require('body-parser');
const request = require('request');
const path = require(`path`);
const crypto = require('crypto');
const fs = require('fs');
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
  var context = {};
  initialize_context().then(function(descriptions) {
        //intialize context
        context = descriptions;

        if(req.session.result_mbti != undefined){
          context.mbtiResult.result = req.session.result_mbti.toString();
        }
        
        if(req.session.result_spirit != undefined){
          context.spiritResult.result = req.session.result_spirit.toString();
        }
      
        //check if all tests completed
        var all_defined = 1;
        for (result_string in context){
          if(context[result_string].result == ""){
            all_defined = 0;
          }
        }
        if (all_defined == 1){
          context.animate = '1';
          //calculate a fantasy character based on results of eight test.
        }
      
        res.render('results.handlebars', context);

  }, function(error) {
      console.error("Failed!", error);
      //intialize placeholder context if failed read
      var context = {
        "mbtiResult" : {
            "result": ""
        },
        "discResult" :  {
          "result": ""
      },
        "personaResult" :  {
          "result": ""
      },
        "eqResult" :  {
          "result": ""
      },
        "enneagramResult" :  {
          "result": ""
      },
        "oceanResult" :  {
          "result": ""
      },
        "sortinghatResult" :  {
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
app.use('/mbtiTest', require('./mbtiTest.js'));

app.use('/spiritTest', require('./spiritTest.js'));

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
