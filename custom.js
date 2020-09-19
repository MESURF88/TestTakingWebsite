module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var fs = require('fs');
    var url = require('url'); 
    var calc_method =  require('./calculate.js');

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

//custom options page
router.get('/', (req, res) => {
    initialize_context().then(function(descriptions) {
        //intialize context
        context = descriptions;

        //Generate random processing id for current user's test submission
        var rand = Math.floor(Math.random() * 100);
        rand *= (Math.floor(Math.random() * 5) + 1);
        context.id = rand;
    
        //set all session to indicies in array
        //persist selects options from sessions
        context.session_arr = [
            req.session.result_ipip,
            req.session.result_jt,
            req.session.result_disc,
            req.session.result_fpq,
            req.session.result_eq,
            req.session.result_eops,
            req.session.result_chrono,
            req.session.result_spirit
        ];
        res.render('custom.handlebars', context);
    
    }, function(error) {
        console.error("Failed!", error);
        //intialize placeholder context if failed read
        var context = {
            "ipipResult" : {
                "result": ""
            },
            "jtResult" :  {
                "result": ""
            },
            "discResult" :  {
                "result": ""
            },
            "fpqResult" :  {
                "result": ""
            },
            "eqResult" :  {
                "result": ""
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
        res.render('custom.handlebars', context);
    });     
});

//custom results
router.post('/:id', (req, res) => {
    //prevent the webpage from recalculating upon redirect from custom
    req.session.display_check = '1';
    var redudant_post = "custom";
    for (prop in req.body){
        if(req.body[prop] === ""){
            redundant_post = "results";
        }
    }
    //custom calculation
    calc_method.calculate_character(req.body).then(function(key) {
        req.session.result_ipip = key['0'];
        req.session.result_jt = key['1'];
        req.session.result_disc = key['2'];
        req.session.result_fpq = key['3'];
        req.session.result_eq = key['4'];
        req.session.result_eops = key['5'];
        req.session.result_chrono = key['6'];
        req.session.result_spirit = key['7'];
        req.session.dnd_char = key['dnd_char'];
        req.session.display_check = '1';
        res.redirect(url.format({
            pathname:"/results",
            query: {
               "reprocess":`${redudant_post}`
             }
          }));
    }, function(error) {
        console.error("Failed!", error);
        res.status(404).end();
    });
});
    return router;
}();