module.exports = function(){
    var express = require('express');
    var router = express.Router();

//MBTI calculation
function calculate_mbti(body){
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

        //Determine mbti based on additive scoring, preference given to more common
        var result_mbti = '';
        var IE_total = arr[0] + arr[1];
        var SN_total = arr[2] + arr[3];
        var TF_total = arr[4] + arr[5];
        var JP_total = arr[6] + arr[7];
        var I_val = arr[0]/IE_total; 
        var E_val = arr[1]/IE_total;
        var S_val = arr[2]/SN_total; 
        var N_val = arr[3]/SN_total;
        var T_val = arr[4]/TF_total; 
        var F_val = arr[5]/TF_total;
        var J_val = arr[6]/JP_total; 
        var P_val = arr[7]/JP_total;
        if (I_val > E_val){
            result_mbti += 'I';
        }
        else{
            result_mbti += 'E';
        }
        if (N_val > S_val){
            result_mbti += 'N';
        }
        else{
            result_mbti += 'S';
        }
        if (F_val > T_val){
            result_mbti += 'F';
        }
        else{
            result_mbti += 'T';
        }
        if (P_val > J_val){
            result_mbti += 'P';
        }
        else{
            result_mbti += 'J';
        }
        resolve(result_mbti);
    });
}

    //MBTI test page
    router.get('/', (req, res) => {
        //Generate random processing id for current user's test submission
        var context = {};
        var rand = Math.floor(Math.random() * 100);
        context.id = rand;
        res.render('mbtiTest.handlebars', context);
    });
    
    //MBTI results
    router.post('/:id', (req, res) => {
            calculate_mbti(req.body).then(function(result_mbti) {
            req.session.result_mbti = result_mbti;
            res.redirect('/results');
        }, function(error) {
            console.error("Failed!", error);
            res.status(404).end();
        });
    });

    return router;
}();