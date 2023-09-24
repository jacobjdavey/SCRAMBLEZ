// GOAL: BUILD BACKEND BY TONIGHT!!

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

let hints = 0;
let numGuesses = 0;
let loops = 0;

function scramble(word){ //function to scramble the word
    let strarray = word.split('');
    let scrambled = "";
    const usedLocations = []; //keep track of used indices so as to not repeat letters

    for (let i = 0; i < strarray.length; i++){
        let location = Math.floor(Math.random() * strarray.length);

        while(usedLocations.includes(String(location))){ //check for used index
            location = Math.floor(Math.random() * strarray.length);
        }
        usedLocations.push(String(location)); //add unused letter index to the used locations
        const letter = strarray[location];
        scrambled += letter;
    }

    return scrambled;
}

async function getRandomFormattedWord() { //return a word without spaces or hyphens
    const url = 'https://wordsapiv1.p.rapidapi.com/words/?random=true'; //wordsAPI
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '5e685cd93dmsh4032646c543eb34p1ebe88jsn5e9b5d361246',
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const word = result.word;
        //check if the word contains spaces or hyphens
        if (word.includes(' ') || word.includes('-')) {
            //if the word does contain them, call the function again until it doesn't
            return getRandomFormattedWord();
        }
        
        return word;
    } catch (error) {
        console.error(error);
        throw new error(error.message);
    }
}

// Function to get a hint (synonym or definition) for a given word
async function getHint(unscrambled, hintType) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '5e685cd93dmsh4032646c543eb34p1ebe88jsn5e9b5d361246',
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
        }
    };

    try {
        let url;
        if (hintType === 'synonym') {
            url = `https://wordsapiv1.p.rapidapi.com/words/${unscrambled}/synonyms`;
        } else if (hintType === 'definition') {
            url = `https://wordsapiv1.p.rapidapi.com/words/${unscrambled}/definitions`;
        }

        const response = await fetch(url, options);
        const result = await response.json();

        if (hintType === 'synonym') {
            const synonyms = result.synonyms;
            const synonym = synonyms[Math.floor(Math.random() * synonyms.length)];
            if(synonym.includes(unscrambled)){
                return getHint(unscrambled, hintType);
            }
            return synonym;
        } else if (hintType === 'definition') {
            const definitions = result.definitions;
            const definition = definitions[Math.floor(Math.random() * definitions.length)].
                                definition;
            if(definition.includes(unscrambled)){
                return getHint(unscrambled, hintType);
            }
            return definition;
        }
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

app.get('/scrambled_word', async (req, res) => { //get a scrambled word
    try {
        const unscrambled = await getRandomFormattedWord();
        const scrambled = scramble(unscrambled);
        res.send(`${unscrambled} ${scrambled}`);
        const info = { 
            'unscrambled' : unscrambled,
            'scrambled' : scrambled
        };
        loops++;
        return info; //return actual word and unscrambled word
    } catch (error) {
        console.error(error);
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

app.patch('/guess', (req, res) =>{ //functionality to take in a guess from the user
    const guess = req.query.guess;
    const unscrambled = req.query.unscrambled;

    if (!guess){ //check if guess is empty
        res.status(400).send('Send a valid guess!');
    }

    else if(guess === unscrambled){ //guess is right
        numGuesses++;
        res.send(`You win! The correct word was: ${unscrambled}`);
    }
    else{
        numGuesses++;
        res.send('Incorrect guess. Try again.');
    }
});

app.get('/guess/hint', async (req,res) =>{ //functionality to give a hint to the user
    const unscrambled = req.query.unscrambled;
    const hintType = req.query.hintType;
    try{
        const hint = await getHint(unscrambled, hintType);
        hints++;
        return (res.send(`Here is the ${hintType}: ${hint}`));
    }
    catch (error){
        console.error(error);
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

app.get('/score', (req, res) => {
    const rawScore = Math.floor(loops/numGuesses);
    const adjustedScore = rawScore - 2*Math.floor(hints/loops);

    res.send(`Your score is ${adjustedScore}%`);
});

app.patch('/score?', (req, res) => {
    score += parseInt(req.query.val);
    res.status(200).send(`${score}`);
});

//TODO: ADD A POST FUNCTION TO DISPLAY SCORE AND GUESSES IN A LIST and OTHER THINGS (results, used words)
app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});