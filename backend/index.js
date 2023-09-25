const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
//INCORPORATE SESSIONS
let hints = 0;
let numGuesses = 0;
let unscrambledWord = '';
let scrambledWord = '';
let score = 0;

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
//TODO: ADD A DIFFICULTY LEVEL
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
        //validate the word
        if (word.includes(' ') || word.includes('-') || word.length > 7 || word.length < 4 || !result.results
                || !result.results[0] || !result.results[0].definition || !result.results[0].synonyms[0]) {
            return getRandomFormattedWord(); //get a different word until a valid word is called
        }
        unscrambledWord = word;
        return word;

    } catch (error) {
        console.error(error);
        throw new error(error.message);
    }
}

// Function to get a hint (synonym or definition) for a given word
async function getHint(hintType) {
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
            url = `https://wordsapiv1.p.rapidapi.com/words/${unscrambledWord}/synonyms`;
        } else if (hintType === 'definition') {
            url = `https://wordsapiv1.p.rapidapi.com/words/${unscrambledWord}/definitions`;
        }

        const response = await fetch(url, options);
        const result = await response.json();

        if (hintType === 'synonym') {
            const synonyms = result.synonyms;
            const synonym = synonyms[Math.floor(Math.random() * synonyms.length)];
            if(synonym.includes(unscrambledWord)){
                return getHint(unscrambledWord, hintType);
            }
            return synonym;
        } else if (hintType === 'definition') {
            const definitions = result.definitions;
            const definition = definitions[Math.floor(Math.random() * definitions.length)].
                                definition;
            if(definition.includes(unscrambledWord)){
                return getHint(unscrambledWord, hintType);
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
        unscrambledWord = await getRandomFormattedWord();
        scrambledWord = scramble(unscrambledWord);
    
        const info = {
            'scrambledWord': scrambledWord, 
            'unscrambledWord': unscrambledWord
        };
        res.json(info);
    } catch (error) {
        console.error(error);
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

app.patch('/guess', (req, res) =>{ //functionality to take in a guess from the user
    const guess = req.query.guess;
    unscrambledWord = req.query.unscrambled;
    if (!guess){ //check if guess is empty
        res.status(400).send('invalid');
    }
    else if(guess === unscrambledWord){ //guess is right
        numGuesses++;
        res.send('correct');
    }
    else{
        numGuesses++;
        res.send('Incorrect guess. Try again.');
    }
});

app.get('/guess/hint', async (req,res) =>{ //functionality to give a hint to the user
    const hintType = req.query.hintType;

    try{
        const hint = await getHint(hintType);
        hints++;
        res.send(`Here is the ${hintType}: ${hint}`);
    }
    catch (error){
        console.error(error);
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

app.get('/score', (res) => {
    res.send(`Your score is ${score}%`);
});

app.patch('/score?', (req, res) => {
    score += parseInt(req.query.val);
    res.status(200).send(`${score}`);
});

app.patch('/score/reset',(req, res) => {
    score = 0;
    res.sendStatus(200);
})

//TODO: ADD A POST FUNCTION TO DISPLAY SCORE AND GUESSES IN A LIST and OTHER THINGS (results, used words)
app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});