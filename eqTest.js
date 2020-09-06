module.exports = function(){
    var express = require('express');
    var router = express.Router();
/*

*                         variable: keys_string
* additive value:   |  1  |  2  |  3  |  4  |  5  |
* -------------------------------------------------
* eq answer key:    |  1  |  2  |  3  |  4  |  5  |
*
*/

//EQ calculation
function calculate_eq(body){
    return new Promise(function(resolve,reject) {
        var questions_answered = Object.keys(body).length - 1;

        const NUM_OPTIONS = 5;
        var key = body.keys_string;
        var key_length = key.length;
        var eq_score = 0;
        ans_idx = 0;
        question_num = 0;
        //Assign additive scores to the total eq score
        for (var i = 0; i < key_length; i++){
            if (parseInt(body[ans_idx]) === (i - (question_num * NUM_OPTIONS))){
                eq_score += ParseInt(key[i]);
            }
            if ((i + 1) % NUM_OPTIONS == 0){
                question_num++;
                ans_idx++;
            }
        }

        //Determine EQ based on additive scoring
        var result_eq = 'Mid-eq';
        if (eq_score < 105){
            var result_eq = 'Low-eq';
        }
        else if (eq_score > 104 && eq_score < 135){
            var result_eq = 'Mid-eq';
        }
        else{
            var result_eq = 'High-eq';
        }

        var result_arr = [];
        result_arr[0] = {};
        result_arr[1] = {};
        result_arr[0].result = result_eq;
        result_arr[1] = eq_score.toString();
        resolve(result_arr);
    });
}

    ///EQ test page
    router.get('/', (req, res) => {
        //Generate random processing id for current user's test submission
        var context = {};
        var rand = Math.floor(Math.random() * 100);
        rand *= (Math.floor(Math.random() * 5) + 1);
        context.id = rand;
        res.render('eqTest.handlebars', context);
    });
    
    //EQ results
    router.post('/:id', (req, res) => {
            calculate_eq(req.body).then(function(result_eq) {
            req.session.result_eq = result_eq[0].result;
            req.session.details_eq = result_eq[1];
            req.session.display_check = '0';
            res.redirect('/results');
        }, function(error) {
            console.error("Failed!", error);
            res.status(404).end();
        });
    });

    return router;
}();