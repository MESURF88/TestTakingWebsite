module.exports = function(){
    var express = require('express');
    var router = express.Router();
/*
*                           variable: keys_string
* additive value:       |  1  |  2  |  3  |  4  |  5  |
* -----------------------------------------------------
* EoPS answer key:      |  1  |  2  |  3  |  4  |  5  |
*
*/

/*
*                           variable: score_matrix
* Question number:              |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |  9  |  10  |  11  |  12  |  13  |  14  |  15  |  16  |  17  |  18  |
* ----------------------------------------------------------------------------------------------------------------------------------------------------
* matrix index:                 |  0  |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |   9  |  10  |  11  |  12  |  13  |  14  |  15  |  16  |  17  |
* key order (type):             |  6  |  1  |  5  |  7  |  4  |  8  |  3  |  5  |  9  |   8  |   8  |   6  |   9  |   8  |   7  |   2  |   6  |   9  |
*
* Question number:      |  19  |  20  |  21  |  22  | 23  |  24  |  25  |  26  |  27  |  28  |  29  |  30  |  31  |  32  |  33  |  34  |  35  |  36  |
* ----------------------------------------------------------------------------------------------------------------------------------------------------
* matrix index:         |  18  |  19  |  20  |  21  |  22  | 23  |  24  |  25  |  26  |  27  |  28  |  29  |  30  |  31  |  32  |  33  |  34  |  35  |
* key order (type):     |   5  |   3  |   2  |   6  |   4  |  7  |   9  |   7  |   3  |   1  |   4  |   2  |   3  |   1  |   2  |   4  |   1  |   5  |
*
*/

//EoPS calculation
function calculate_eops(body){
    return new Promise(function(resolve,reject) {
        var questions_answered = Object.keys(body).length - 1;

        var score_matrix = [
            6 , 1 , 5 , 7 , 4 , 8 , 3 , 5 , 9 , 8 , 8 , 6 , 9 , 8 , 7 , 2 , 6 , 9 ,
            5 , 3 , 2 , 6 , 4 , 7 , 9 , 7 , 3 , 1 , 4 , 2 , 3 , 1 , 2 , 4 , 1 , 5
        ];

        const NUM_OPTIONS = 5;
        var key = body.keys_string;
        var key_length = key.length;
        var eops_bins = {}
        eops_bins['Reformer'] = 0;
        eops_bins['Helper'] = 0;
        eops_bins['Achiever'] = 0;
        eops_bins['Individualist'] = 0;
        eops_bins['Investigator'] = 0;
        eops_bins['Loyalist'] = 0; 
        eops_bins['Enthusiast'] = 0; 
        eops_bins['Challenger'] = 0;
        eops_bins['Peacemaker'] = 0;
        ans_idx = 0;
        question_num = 0;
        //Assign additive scores for the 9 EoPS bins
        for (var i = 0; i < key_length; i++){
            if (parseInt(body[ans_idx]) === (i - (question_num * NUM_OPTIONS))){
                switch (score_matrix[question_num]){
                    case 1:
                        eops_bins['Reformer'] += parseInt(key[i]);
                        break;
                    case 2:
                        eops_bins['Helper'] += parseInt(key[i]);
                        break;
                    case 3:
                        eops_bins['Achiever'] += parseInt(key[i]);
                        break;
                    case 4:
                        eops_bins['Individualist'] += parseInt(key[i]);
                        break;
                    case 5:
                        eops_bins['Investigator'] += parseInt(key[i]);
                        break;
                    case 6:
                        eops_bins['Loyalist'] += parseInt(key[i]);
                        break;
                    case 7:
                        eops_bins['Enthusiast'] += parseInt(key[i]);
                        break;
                    case 8:
                        eops_bins['Challenger'] += parseInt(key[i]);
                        break;
                    case 9:
                        eops_bins['Peacemaker'] += parseInt(key[i]);
                        break;
                }
            }
            if ((i + 1) % NUM_OPTIONS == 0){
                question_num++;
                ans_idx++;
            }
        }

        //Find maximum value of dictionary
        var max = 0;
        var prop_max = '';
        for(var prop in eops_bins) {
            if(eops_bins[prop] > max){
                max = eops_bins[prop];
                prop_max = prop;
            } 
        }

        //Determine EoPS based on additive scoring
        var result_eops = prop_max;

        resolve(result_eops);
    });
}

    ///EoPS test page
    router.get('/', (req, res) => {
        //Generate random processing id for current user's test submission
        var context = {};
        var rand = Math.floor(Math.random() * 100);
        rand *= (Math.floor(Math.random() * 5) + 1);
        context.id = rand;
        res.render('eopsTest.handlebars', context);
    });
    
    //EoPS results
    router.post('/:id', (req, res) => {
            calculate_eops(req.body).then(function(result_eops) {
            req.session.result_eops = result_eops;
            req.session.display_check = '0';
            res.redirect('/results');
        }, function(error) {
            console.error("Failed!", error);
            res.status(404).end();
        });
    });

    return router;
}();