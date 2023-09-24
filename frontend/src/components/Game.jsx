import {useState, useEffect} from 'react';
import { Input, Button } from 'antd';
import axios from 'axios';

function Game(){

    const [word, setWord] = useState('hello');
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
            setWord(response.data);
            })
            .catch((error) => {
            console.log(error);
            });
    });

    const handleSubmit = () => {
        let config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/guess?guess=hello&unscrambled=hello',
            headers: { }
          };
          
          axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return( <div className = "card">
        <h2>Current word: {word}</h2>
        <Input size = 'large' placeholder='Enter your guess'
            onChange={(input) => {setGuess(input.target.value);}}/> 
        <br/> <br/>
        <Button type = 'default' size = 'large' onClick = {handleSubmit}>Submit</Button>
        <p>Score: 0</p>
    </div>

    )
}

export default Game;