module.exports = function(){
    var express = require('express');
    var router = express.Router();
/*
*   variable: key_string
* additive value:           |  1  | 
* ---------------------------------
* Bear answer key:          |  0  |
* Dove answer key:          |  1  |
* Elephant answer key:      |  2  |
* Fox answer key:           |  3  |
* Hawk answer key:          |  4  |
* Owl answer key:           |  5  |
* Peacock answer key:       |  6  |
* Turtle answer key:        |  7  |
* Wolf answer key:          |  8  |
* Dolphin answer key:       |  9  |
* Tiger answer key:         |  A  |
* Deer answer key:          |  B  |
*
*/

//Spirit calculation
function calculate_spirit_animal(body){
    return new Promise(function(resolve,reject) {

        function determine_scale(char_value){
            var idx_value = 0;
            var idx_property = '';
            if (char_value < 58 && char_value > 47){
                idx_value = char_value - 48;
            }
            else{
                idx_value = char_value - 55;
            }
            switch (idx_value){
                case 0:
                    idx_property = 'Bear';
                    break;
                case 1:
                    idx_property = 'Dove';
                    break;
                case 2:
                    idx_property = 'Elephant';
                    break;
                case 3:
                    idx_property = 'Fox';
                    break;
                case 4:
                    idx_property = 'Hawk';
                    break;
                case 5:
                    idx_property = 'Owl';
                    break;
                case 6:
                    idx_property = 'Peacock';
                    break;
                case 7:
                    idx_property = 'Turtle';
                    break;
                case 8:
                    idx_property = 'Wolf';
                    break;
                case 9:
                    idx_property = 'Dolphin';
                    break;
                case 10:
                    idx_property = 'Tiger';
                    break;
                case 11:
                    idx_property = 'Deer';
                    break;
            }
            return idx_property;
        };
        var key = body.keys_string;
        var key_length = key.length; 
        var animal_bins = {};
        animal_bins['Bear'] = 0;
        animal_bins['Dove'] = 0;
        animal_bins['Elephant'] = 0;
        animal_bins['Fox'] = 0;
        animal_bins['Hawk'] = 0;
        animal_bins['Owl'] = 0;
        animal_bins['Peacock'] = 0;
        animal_bins['Turtle'] = 0;
        animal_bins['Wolf'] = 0;
        animal_bins['Dolphin'] = 0;
        animal_bins['Tiger'] = 0;
        animal_bins['Deer'] = 0;
       
        ans_idx = 0;
        question_num = 0;
        for (var i = 0; i < key_length; i++){
            if (parseInt(body[ans_idx]) === (i - (question_num * 4))){
                var char_val = key[i].charCodeAt();
                var prop_idx = determine_scale(char_val);
                animal_bins[prop_idx]++;
            }
            if ((i + 1) % 4 == 0){
                question_num++;
                ans_idx++;
            }
        }

        //Find maximum value of dictionary
        var max = 0;
        var prop_max = '';
        for(var prop in animal_bins) {
            if(animal_bins[prop] > max){
                max = animal_bins[prop];
                prop_max = prop;
            } 
        }

        //Determine spirit based on additive scoring
        var result_spirit = prop_max;
        
        resolve(result_spirit);
    });
}

    ///Spirit Animal test page
    router.get('/', (req, res) => {
        //Generate random processing id for current user's test submission
        var context = {};
        var rand = Math.floor(Math.random() * 100);
        rand *= (Math.floor(Math.random() * 5) + 1);
        context.id = rand;
        res.render('spiritTest.handlebars', context);
    });
    
    //Spirit results
    router.post('/:id', (req, res) => {
            calculate_spirit_animal(req.body).then(function(result_spirit) {
            req.session.result_spirit = result_spirit;
            req.session.display_check = '0';
            res.redirect('/results');
        }, function(error) {
            console.error("Failed!", error);
            res.status(404).end();
        });
    });

    return router;
}();