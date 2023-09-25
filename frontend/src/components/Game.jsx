import {useState, useEffect} from 'react';
import { Input, Button, notification, FloatButton, message } from 'antd';
import { QuestionCircleOutlined, BulbOutlined } from '@ant-design/icons';
import axios from 'axios';

function Game(){

    const [scrambled, setScrambled] = useState('');
    const [word, setWord] = useState('');
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
            })
            .catch((error) => {
                console.log(error);
            });
    }, [score]);

    console.log(scrambled);
    console.log(word);

    const handleChange = (e) => { //called when the input box is changed (onChange)
        setGuess(e.target.value); //set guess to value input
    };


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
                        description: `You guessed the word "${word}" correctly!`,
                        placement: "topRight",
                        duration: 2
                    });
                } else{
                    notification.error({
                        message: "Incorrect!",
                        description: `Please try again!`,
                        placement: "topRight",
                        duration: 2
                    });
                }
                setGuess("");
            })
            .catch((error) => {
                console.log(error);
            });
        setGuess("");
    };

    const giveHint = (typeofhint) => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `http://localhost:3000/guess/hint?hintType=${typeofhint}`,
            headers: { }
          };
          
        axios.request(config)
            .then((response) => {
                message.info(response.data);         
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return( <div className = "card">
        <h2>Current word: {scrambled}</h2>
        <Input size='large' placeholder='Enter your guess'
            onChange={handleChange} value={guess}/> 
        <br/> <br/>
        <Button type='default' size='large' onClick={handleSubmit}>Submit</Button>

        <FloatButton.Group shape="square">
            <FloatButton icon={<QuestionCircleOutlined />} type='primary' 
                tooltip = 'Click for the definition!' onClick={() => giveHint('definition')}/>
            <FloatButton icon={<BulbOutlined />} type='primary'
                tooltip = 'Click for a synonym!' onClick ={() => giveHint('synonym')}/>
        </FloatButton.Group>

        <p>Score: {score}</p>
    </div>
    )
}

export default Game;