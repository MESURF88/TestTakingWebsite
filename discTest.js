module.exports = function(){
    var express = require('express');
    var router = express.Router();
/*
*                         variable: keys_string
* additive value:   |  1  |  2  |  3  |  4  |  5  |
* -------------------------------------------------
* D answer key:     |  1  |  2  |  3  |  4  |  5  |
* I answer key:     |  6  |  7  |  8  |  9  |  A  |
* S answer key:     |  B  |  C  |  D  |  E  |  F  |
* C answer key:     |  G  |  H  |  I  |  J  |  K  |
*
*/

//DISC calculation
function calculate_disc(body){
    return new Promise(function(resolve,reject) {
        var questions_answered = Object.keys(body).length - 1;

        function determine_scale(char_value, range){
            var score_value = 0;
            switch (range) {
                case 'D':
                    score_value = char_value - 48;
                    break;
                case 'I':
                    if (char_value === 65){
                        score_value = char_value - 60;
                    }
                    else{
                        score_value = char_value - 53;
                    }
                    break;
                case 'S':
                    score_value = char_value - 65;
                    break;
                case 'C':
                    score_value = char_value - 70;
                    break;
            }
            return score_value;
        };
        const NUM_OPTIONS = 5;
        var key = body.keys_string;
        var key_length = key.length;
        var quadrants = {};
        quadrants['D'] = 0;
        quadrants['I'] = 0;
        quadrants['S'] = 0;
        quadrants['C'] = 0;
        ans_idx = 0;
        question_num = 0;
        //Assign additive scores to each of the 4 quadrants
        for (var i = 0; i < key_length; i++){
            if (parseInt(body[ans_idx]) === (i - (question_num * NUM_OPTIONS))){
                var char_val = key[i].charCodeAt();
                if (char_val > 48 && char_val < 54){
                    var score = determine_scale(char_val, 'D');
                    quadrants['D'] += score;
                }
                else if (char_val > 53 && char_val < 66){
                    var score = determine_scale(char_val, 'I');
                    quadrants['I'] += score;
                }
                else if (char_val > 65 && char_val < 71){
                    var score = determine_scale(char_val, 'S');
                    quadrants['S'] += score;
                }
                else if (char_val > 70 && char_val < 76){
                    var score = determine_scale(char_val, 'C');
                    quadrants['C'] += score;
                }       
            }
            if ((i + 1) % NUM_OPTIONS == 0){
                question_num++;
                ans_idx++;
            }
        }

        //Determine disc based on additive scoring
        var result_disc = 'D';

 
        resolve(result_disc);
    });
}

    ///DISC test page
    router.get('/', (req, res) => {
        //Generate random processing id for current user's test submission
        var context = {};
        var rand = Math.floor(Math.random() * 100);
        rand *= (Math.floor(Math.random() * 5) + 1);
        context.id = rand;
        res.render('discTest.handlebars', context);
    });
    
    //DISC results
    router.post('/:id', (req, res) => {
            calculate_disc(req.body).then(function(result_disc) {
            req.session.result_disc = result_disc;
            req.session.display_check = '0';
            res.redirect('/results');
        }, function(error) {
            console.error("Failed!", error);
            res.status(404).end();
        });
    });

    return router;
}();