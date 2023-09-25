import {useState, useEffect} from 'react';
import { Input, Button, notification } from 'antd';
import axios from 'axios';

function Game(){

    const [scrambled, setScrambled] = useState('hello');
    const [word, setWord] = useState('hi');
    const [score, setScore] = useState(0);
    const [guess, setGuess] = useState('');

    useEffect(() => {
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://localhost:3000/scrambled_word',
          headers: { }
        };
        
        axios.request(config)
            .then((response) => {
                setScrambled(response.data.scrambledWord);
                setWord(response.data.unscrambledWord);
                console.log(scrambled);
                console.log(word);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [score]);

    const handleChange = (e) => { //called when the input box is changed (onChange)
        setGuess(e.target.value); //set guess to value input
    }


    const handleSubmit = () => { 
        let config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: `http://localhost:3000/guess?guess=${guess}&unscrambled=${word}`, //guess from input and word from useEffect
            headers: { }
          };
          
        axios.request(config)
            .then((response) => {
                if(response.data === 'correct'){
                    setScore(score + 1);
                    notification.success({
                        message: "Correct!",
                        description: `You guessed the word - ${word} - correctly!`,
                        placement: "bottomRight",
                        duration: 2
                    });
                } else{
                    notification.error({
                        message: "Incorrect!",
                        description: `Please try again!`,
                        placement: "bottomRight",
                        duration: 2
                    });
                    // giveHint();
                }
                setGuess("");
            })
            .catch((error) => {
                console.log(error);
            });
        setGuess("");
    }

    return( <div className = "card">
        <h2>Current word: {scrambled}</h2>
        <Input size='large' placeholder='Enter your guess'
            onChange={handleChange} value={guess}/> 
        <br/> <br/>
        <Button type='default' size='large' onClick={handleSubmit}>Submit</Button>
        <p>Score: {score}</p>
    </div>

    )
}

export default Game;