module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var fs = require('fs');

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

//custom calculation
function calculate_custom(body){
    return new Promise(function(resolve,reject) {
        var key = body;
        console.log(key);
        var key_length = Object.keys(key).length; 
        var dnd_char_total = 12;
        var chosen_char_arr = Array.from({ length: dnd_char_total });
        chosen_char_arr.fill(0);
        var dnd_arr = [
            ['Bear', 2],
            [3, 4],
            [5, 6]
        ];

        for (var i = 0; i < key_length; i++){
            for (var j = 0; j < key_length; j++){
                for (attribute in dnd_arr[j]){
                    if (attribute === key[i]){
                        chosen_char_arr[j]++;
                    }
                }
            }
        }

        //Determine dnd character based on additive scoring, ipip and jt results are given more weight
        var dnd_char = 'Barbarian';
        key['dnd_char'] = dnd_char;
        resolve(key);
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
        calculate_custom(req.body).then(function(key) {
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
        res.redirect('/results');
    }, function(error) {
        console.error("Failed!", error);
        res.status(404).end();
    });
});

//custom results from tests all defined
router.post('/results/:id', (req, res) => {
        calculate_custom(req.body).then(function(key) {
        req.session.dnd_char = key['dnd_char'];
        req.session.display_check = '1';
        res.redirect('/results');
    }, function(error) {
        console.error("Failed!", error);
        res.status(404).end();
    });
});

    return router;
}();