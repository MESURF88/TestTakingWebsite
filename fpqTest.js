module.exports = function(){
    var express = require('express');
    var router = express.Router();
/*
*                                   variable: keys_string
* additive value:               |  1  |  2  |  3  |  4  |
* -------------------------------------------------------------
* Explorer answer key:          |  1  |  2  |  3  |  4  |
* Builder answer key:           |  5  |  6  |  7  |  8  |
* Director answer key:          |  9  |  A  |  B  |  C  |
* Negotiator answer key:        |  D  |  E  |  F  |  G  |
*
*/

//FPQ calculation
function calculate_fpq(body){
    return new Promise(function(resolve,reject) {
        var questions_answered = Object.keys(body).length - 1;

        function determine_scale(char_value, range){
            var score_value = 0;
            switch (range) {
                case 'Explorer':
                    score_value = char_value - 48;
                    break;
                case 'Builder':
                    score_value = char_value - 52;
                    break;
                case 'Director':
                    if (char_value === 57){
                        score_value = char_value - 56;
                    }
                    else{
                        score_value = char_value - 63;
                    }
                    break;
                case 'Negotiator':
                    score_value = char_value - 67;
                    break;
            }
            return score_value;
        };
        const NUM_OPTIONS = 4;
        var key = body.keys_string;
        var key_length = key.length;
        var temperaments = {};
        temperaments['Explorer'] = 0;
        temperaments['Builder'] = 0;
        temperaments['Director'] = 0;
        temperaments['Negotiator'] = 0;
        ans_idx = 0;
        question_num = 0;
        //Assign additive scores to each of the 4 temperaments
        for (var i = 0; i < key_length; i++){
            if (parseInt(body[ans_idx]) === (i - (question_num * NUM_OPTIONS))){
                var char_val = key[i].charCodeAt();
                if (char_val > 48 && char_val < 53){
                    var score = determine_scale(char_val, 'Explorer');
                    temperaments['Explorer'] += score;
                }
                else if (char_val > 52 && char_val < 57){
                    var score = determine_scale(char_val, 'Builder');
                    temperaments['Builder'] += score;
                }
                else if (char_val > 56 && char_val < 68){
                    var score = determine_scale(char_val, 'Director');
                    temperaments['Director'] += score;
                }
                else if (char_val > 67 && char_val < 72){
                    var score = determine_scale(char_val, 'Negotiator');
                    temperaments['Negotiator'] += score;
                }       
            }
            if ((i + 1) % NUM_OPTIONS == 0){
                question_num++;
                ans_idx++;
            }
        }

        //Determine FPQ based on additive scoring
        var result_fpq = 'Explorer';

 
        resolve(result_fpq);
    });
}

    ///FPQ test page
    router.get('/', (req, res) => {
        //Generate random processing id for current user's test submission
        var context = {};
        var rand = Math.floor(Math.random() * 100);
        rand *= (Math.floor(Math.random() * 5) + 1);
        context.id = rand;
        res.render('fpqTest.handlebars', context);
    });
    
    //FPQ results
    router.post('/:id', (req, res) => {
            calculate_fpq(req.body).then(function(result_fpq) {
            req.session.result_fpq = result_fpq;
            req.session.display_check = '0';
            res.redirect('/results');
        }, function(error) {
            console.error("Failed!", error);
            res.status(404).end();
        });
    });

    return router;
}();