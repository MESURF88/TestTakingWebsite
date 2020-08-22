const express = require('express');
const session = require('express-session')
const app = express();

const bodyParser = require('body-parser');
const request = require('request');
const path = require(`path`);
const crypto = require('crypto');
const { totalmem } = require('os');

var handlebars = require('express-handlebars').create({defaultLayout:'main'});

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


/* ------------- Begin Controller Functions ------------- */

//Results page
router.get('/results', (req, res) => {
  var context = {
    "mbtiResult" : "",
    /*"discResult" : "",
    "personaResult" : "",
    "eqResult" : "",
    "enneagramResult" : "",
    "oceanResult" : "",
    "sortinghatResult" : "",*/
    "spiritResult": ""
  }

  if(req.session.result_mbti != undefined){
    context.mbtiResult = req.session.result_mbti;
  }
  
  if(req.session.result_spirit != undefined){
    context.spiritResult = req.session.result_spirit;
  }

  var all_defined = 1;
  for (result_string in context){
    if(context[result_string] == ""){
      all_defined = 0;
    }
  }
  if (all_defined == 1){
    //TODO: cool css animation
    context.animate = '1';
  }

  res.render('results.handlebars', context);
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
