module.exports = function(){
    var express = require('express');
    var router = express.Router();

//Spirit calculation
function calculate_spirit_animal(body){
    return new Promise(function(resolve,reject) {
        var key = body.keys_string;
        var key_length = key.length; 
        var max = 0;
        for (var j = 0; j < key_length; j++){
            if(key[j] > max){
            max = key[j];
            }
        }
        max++;
        var arr = Array.from({ length: max });
        arr.fill(0);
        ans_idx = 0;
        question_num = 0;
        for (var i = 0; i < key_length; i++){
            if (parseInt(body[ans_idx]) === (i - (question_num * 4))){
            arr[key[i]]++;
            }
            if ((i + 1) % 4 == 0){
            question_num++;
            ans_idx++;
            }
        }

        //Determine spirit based on additive scoring
        var result_spirit = 'Wolf';
        
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