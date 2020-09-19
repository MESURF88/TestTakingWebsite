//character calculation
function calculate_character(body){
    return new Promise(function(resolve,reject) {
        var key = body;
        var key_length = Object.keys(key).length; 
        var dnd_char_total = 12;
        var chosen_char_arr = Array.from({ length: dnd_char_total });
        chosen_char_arr.fill(0);
        var dnd_attrib_arr = [
            ["High-ES","High-E","ESTP","ENTJ","D","Director","Low-eq","Challenger","Day-type","Bear"],
            ["High-AI","High-A","ISFP","ESFP","I","Explorer","High-eq","Peacemaker","Evening-type","Dolphin"],
            ["High-AC","High-S","INFP","ENTP","S","Negotiator","High-eq","Achiever","Morning-type","Dove"],
            ["High-CS","High-I","INTJ","ISFJ","C","Builder","Low-eq","Achiever","Morning-type","Turtle"],
            ["High-CE","High-S","ESTJ","ESTP","D","Director","Mid-eq","Loyalist","Day-type","Wolf"],
            ["High-IS","High-C","ISFJ","ISTJ","I","Explorer","Low-eq","Reformer","Morning-type","Deer"],
            ["High-EA","High-E","ENTJ","ESFJ","D","Director","Mid-eq","Helper","Day-type","Elephant"],
            ["High-IE","High-C","ISTJ","ENFP","C","Builder","Low-eq","Loyalist","Evening-type","Hawk"],
            ["High-C","High-CI","ISTP","ISFP","C","Builder","High-eq","Individualist","Evening-type","Fox"],
            ["High-AS","High-A","ENFJ","ENFP","S","Negotiator","High-eq","Enthusiast","Day-type","Tiger"],
            ["High-I","High-CE","INFJ","ENTP","I","Explorer","Mid-eq","Individualist","Evening-type","Peacock"],
            ["High-CI","High-I","INTP","INTJ","S","Negotiator","Mid-eq","Investigator","Morning-type","Owl"]
        ];
        var attrib_length = Object.keys(dnd_attrib_arr[0]).length;
        for (var i = 0; i < key_length; i++){
            for (var j = 0; j < dnd_char_total; j++){
                for (var y = 0; y < attrib_length; y++){
                    if (dnd_attrib_arr[j][y] === key[i]){
                        chosen_char_arr[j]++;
                    }
                }
            }
        }
        console.log(chosen_char_arr);//TODO: remove
        //Determine dnd character based on additive scoring, if tie,
        //ipip, jt results are given more weight (x3)
        //eops results are given (x2)
        //if still tie, due to lack of results,
        //defer to previous.
        var max = 0;
        for (var i = 0; i < dnd_char_total; i++){
            if (chosen_char_arr[i] > chosen_char_arr[max]){
                max = i;
            }
            else if (chosen_char_arr[i] === chosen_char_arr[max]){
                //apply weights
                var prev = 0;
                var curr = 0;
                for (var j = 0; j < 8; j++){
                    if ((j < 3) && (dnd_attrib_arr[max][j]  === key[0])){
                        prev += chosen_char_arr[max] * 3;
                    }
                    else if ((j < 5) && (dnd_attrib_arr[max][j] === key[1])){
                        prev += chosen_char_arr[max] * 3;
                    }
                    else if ((j == 7) && (dnd_attrib_arr[max][j] === key[5])){
                        prev += chosen_char_arr[max] * 2;
                    }
                    if ((j < 3) && (dnd_attrib_arr[i][j]  === key[0])){
                        curr += chosen_char_arr[i] * 3;
                    }
                    else if ((j < 5) && (dnd_attrib_arr[i][j] === key[1])){
                        curr += chosen_char_arr[i] * 3;
                    }
                    else if ((j == 7) && (dnd_attrib_arr[i][j] === key[5])){
                        curr += chosen_char_arr[i] * 2;
                    }
                }
                if (curr > prev){
                    max = i;
                }
            }
        }

        var dnd_char = '';
        switch (max) {
            case 0:
                dnd_char = "Barbarian";
                break;
            case 1:
                dnd_char = "Bard";
                break;
            case 2:
                dnd_char = "Cleric";
                break;
            case 3:
                dnd_char = "Druid";
                break;
            case 4:
                dnd_char = "Fighter";
                break;
            case 5:
                dnd_char = "Monk";
                break;
            case 6:
                dnd_char = "Paladin";
                break;
            case 7:
                dnd_char = "Ranger";
                break;
            case 8:
                dnd_char = "Rogue";
                break;
            case 9:
                dnd_char = "Sorcerer";
                break;
            case 10:
                dnd_char = "Warlock";
                break;
            case 11:
                dnd_char = "Wizard";
                break;
        }
        key['dnd_char'] = dnd_char;
        resolve(key);
    });
}

module.exports = { calculate_character };