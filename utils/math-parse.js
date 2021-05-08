function rand_between(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function roll_dice(sum) {
    let d = sum.indexOf("d");
    let amount = 0;
    let f = 0;
    let die = "";
    let modifier = "";
    let modtype = "";
    let results = [];
    let total = 0;
    let final = [];
    let pretty = "";
    let check = 0;

    if (d > 0) {
        amount = parseInt(sum.slice(0, d));
    }

    // find modifiers
    if (sum.indexOf("+") !== -1) {
        f = sum.indexOf("+");
        modtype = "+"
    } else if (sum.indexOf("-") !== -1) {
        f = sum.indexOf("-");
        modtype = "-"
    }
    else {
        f = 0;
    }

    if (f) {
        // find die type
        die = sum.slice(d + 1, f);
        // get modifier amount
        modifier = parseInt(sum.slice(f));
    } else {
        // find die type
        die = sum.slice(d + 1);
    }

    // Get Dice Rolls
    if (amount) {
        for (i = 0; i < amount; i++) {
            results.push(rand_between(1, parseInt(die)));
        }
    } else {
        results.push(rand_between(1, parseInt(die)));
    }

    // Get rolls total
    results.forEach(num => {
        total = total + num;
    });

    // Prettify and return results
    if (modtype === "+") {
        total = total + modifier;
        pretty = JSON.stringify(results) + modtype + JSON.stringify(modifier) + "=" + total;
    }
    else if (modtype === "-") {
        total = total + modifier;
        pretty = JSON.stringify(results) + JSON.stringify(modifier) + "=" + total;
    }
    else {
        pretty = JSON.stringify(results) + "=" + total;
    }

    check = pretty.search("NaN");
    if (check > 0)
        pretty = "I'm sorry, I didn't quite understand that command."
    
    check = pretty.search("null");
    if (check > 0)
        pretty = "I'm sorry, I didn't quite understand that command."

    return pretty;
}

/*
module.exports = {
    rand_between,
    roll_dice
};
*/

console.log(roll_dice(" 2d   10 +4"));