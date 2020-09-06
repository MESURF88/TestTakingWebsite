module.exports = function(){
    var express = require('express');
    var router = express.Router();
/*
*                           variable: keys_string
* additive value:       |  A  |  B  |  C  |  D  |  E  |
* -----------------------------------------------------
* Chrono answer key:    | -2  | -1  |  0  |  1  |  2  |
*
*/

//Chrono calculation
function calculate_chrono(body){
    return new Promise(function(resolve,reject) {
        var questions_answered = Object.keys(body).length - 1;

        function determine_scale(char_value){
            var score_value = 0;
            switch (char_value) {
                case 'A':
                    score_value = -2;
                    break;
                case 'B':
                    score_value = -1;
                    break;
                case 'C':
                    score_value = 0;
                    break;
                case 'D':
                    score_value = 1;
                    break;
                case 'E':
                    score_value = 2;
                    break;
            }
            return score_value;
        };
        const NUM_OPTIONS = 5;
        var key = body.keys_string;
        var key_length = key.length;
        var chrono_score = 0;
        ans_idx = 0;
        question_num = 0;
        //Assign additive scores to the total Chronoscore
        for (var i = 0; i < key_length; i++){
            if (parseInt(body[ans_idx]) === (i - (question_num * NUM_OPTIONS))){
                var char_val = key[i]
                chrono_score += determine_scale(char_val);
            }
            if ((i + 1) % NUM_OPTIONS == 0){
                question_num++;
                ans_idx++;
            }
        }

        //Determine Chrono based on additive scoring
        var result_chrono= '';
        if (chrono_score < -1){
            result_chrono= 'Morning-type';
        }
        else if (chrono_score > 1){
            result_chrono= 'Evening-type';
        }
        else{
            result_chrono= 'Day-type';
        }
 
        resolve(result_chrono);
    });
}

    ///Chrono test page
    router.get('/', (req, res) => {
        //Generate random processing id for current user's test submission
        var context = {};
        var rand = Math.floor(Math.random() * 100);
        rand *= (Math.floor(Math.random() * 5) + 1);
        context.id = rand;
        res.render('chronoTest.handlebars', context);
    });
    
    //Chrono results
    router.post('/:id', (req, res) => {
            calculate_chrono(req.body).then(function(result_chrono) {
            req.session.result_chrono= result_chrono;
            req.session.display_check = '0';
            res.redirect('/results');
        }, function(error) {
            console.error("Failed!", error);
            res.status(404).end();
        });
    });

    return router;
}();