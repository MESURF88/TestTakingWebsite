module.exports = function(){
    var express = require('express');
    var router = express.Router();
/*
*                         variable: keys_string
* additive value:   |  1  |  2  |  3  |  4  |  5  |
* -------------------------------------------------
* C answer key:     |  1  |  2  |  3  |  4  |  5  |
* E answer key:     |  6  |  7  |  8  |  9  |  A  |
* A answer key:     |  B  |  C  |  D  |  E  |  F  |
* I answer key:     |  G  |  H  |  I  |  J  |  K  |
* S answer key:     |  L  |  M  |  N  |  O  |  P  |
*
*/

//IPIP calculation
function calculate_ipip(body){
    return new Promise(function(resolve,reject) {
        var questions_answered = Object.keys(body).length - 1;

        function determine_scale(char_value, range){
            var score_value = 0;
            switch (range) {
                case 'C':
                    score_value = char_value - 48;
                    break;
                case 'E':
                    if (char_value === 65){
                        score_value = char_value - 60;
                    }
                    else{
                        score_value = char_value - 53;
                    }
                    break;
                case 'A':
                    score_value = char_value - 65;
                    break;
                case 'I':
                    score_value = char_value - 70;
                    break;
                case 'S':
                    score_value = char_value - 75;
                    break;
            }
            return score_value;
        };
        const NUM_OPTIONS = 5;
        var key = body.keys_string;
        var key_length = key.length;
        var dimensions = {};
        dimensions['C'] = 0;
        dimensions['E'] = 0;
        dimensions['A'] = 0;
        dimensions['I'] = 0;
        dimensions['S'] = 0;
        ans_idx = 0;
        question_num = 0;
        //Assign additive scores to each of the 5 dimensions
        for (var i = 0; i < key_length; i++){
            if (parseInt(body[ans_idx]) === (i - (question_num * NUM_OPTIONS))){
                var char_val = key[i].charCodeAt();
                if (char_val > 48 && char_val < 54){
                    var score = determine_scale(char_val, 'C');
                    dimensions['C'] += score;
                }
                else if (char_val > 53 && char_val < 66){
                    var score = determine_scale(char_val, 'E');
                    dimensions['E'] += score;
                }
                else if (char_val > 65 && char_val < 71){
                    var score = determine_scale(char_val, 'A');
                    dimensions['A'] += score;
                }
                else if (char_val > 70 && char_val < 76){
                    var score = determine_scale(char_val, 'I');
                    dimensions['I'] += score;
                }
                else if (char_val > 75 && char_val < 81){
                    var score = determine_scale(char_val, 'S');
                    dimensions['S'] += score;
                }          
            }
            if ((i + 1) % NUM_OPTIONS == 0){
                question_num++;
                ans_idx++;
            }
        }

        //Find maximum value of dictionary and second maximum value
        var max_first = 0;
        var prop_first = '';
        var max_second = 0;
        var prop_second = '';
        for(var prop in dimensions) {
            if(dimensions[prop] > max_first){
                max_first = dimensions[prop];
                prop_first = prop;
            } 
        }
        for(var prop in dimensions) {
            if((dimensions[prop] > max_second) && (prop != prop_first)){
                max_second = dimensions[prop];
                prop_second = prop;
            } 
        }
        console.log(dimensions);//TODO: remove
        //Determine ipip based on additive scoring
        var result_ipip = '';
        //Check if prop_second and prop_first are empty 
        if ((prop_first === '') && (prop_second === '')){
            //Not enough data, default of most common
            result_ipip = 'High-C';
        }
        else{
            //Find margin between first and second dimension within 20% of answered questions
            var margin = Math.floor(questions_answered * 0.20);
            //Check if two dimensions, if first and second dimension within margin or if prop_second is empty
            if (((max_first-max_second) >= margin) || (prop_second === '')){
                //One dimension dominates
                switch (prop_first) {
                    case 'C':
                        result_ipip = "High-C";
                        break;
                    case 'E':
                        result_ipip = "High-E";
                        break;
                    case 'A':
                        result_ipip = "High-A";
                        break;
                    case 'I':
                        result_ipip = "High-I";
                        break;
                    case 'S':
                        result_ipip = "High-S";
                        break;
                    }
            }
            else{
                //Two dimensions dominate
                var combined_prop = prop_first + prop_second;
                if ((combined_prop === 'CE') || (combined_prop === 'EC')){
                    result_ipip = "High-CE";
                }
                else if ((combined_prop === 'AC') || (combined_prop === 'CA')){
                    result_ipip = "High-AC";
                }
                else if ((combined_prop === 'CI') || (combined_prop === 'IC')){
                    result_ipip = "High-CI";
                }
                else if ((combined_prop === 'CS') || (combined_prop === 'SC')){
                    result_ipip = "High-CS";
                }
                else if ((combined_prop === 'EA') || (combined_prop === 'AE')){
                    result_ipip = "High-EA";
                }
                else if ((combined_prop === 'IE') || (combined_prop === 'EI')){
                    result_ipip = "High-IE";
                }
                else if ((combined_prop === 'ES') || (combined_prop === 'SE')){
                    result_ipip = "High-ES";
                }
                else if ((combined_prop === 'AI') || (combined_prop === 'IA')){
                    result_ipip = "High-AI";
                }
                else if ((combined_prop === 'AS') || (combined_prop === 'SA')){
                    result_ipip = "High-AS";
                }
                else if ((combined_prop === 'IS') || (combined_prop === 'SI')){
                    result_ipip = "High-IS";
                }
            }
            
        }
 
        resolve(result_ipip);
    });
}

    ///IPIP test page
    router.get('/', (req, res) => {
        //Generate random processing id for current user's test submission
        var context = {};
        var rand = Math.floor(Math.random() * 100);
        rand *= (Math.floor(Math.random() * 5) + 1);
        context.id = rand;
        res.render('ipipTest.handlebars', context);
    });
    
    //IPIP results
    router.post('/:id', (req, res) => {
            calculate_ipip(req.body).then(function(result_ipip) {
            req.session.result_ipip = result_ipip;
            req.session.display_check = '0';
            res.redirect('/results');
        }, function(error) {
            console.error("Failed!", error);
            res.status(404).end();
        });
    });

    return router;
}();