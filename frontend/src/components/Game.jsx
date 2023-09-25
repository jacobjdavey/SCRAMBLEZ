import {useState, useEffect} from 'react';
import { Input, Button, notification, FloatButton, message } from 'antd';
import { QuestionCircleOutlined, BulbOutlined } from '@ant-design/icons';
import axios from 'axios';

function Game(){

    const [scrambled, setScrambled] = useState('');
    const [word, setWord] = useState('');
    const [score, setScore] = useState(0);
    const [guess, setGuess] = useState('');
    const [loops, setLoops] = useState(0);
    const [gameState, setGameState] = useState('playing');

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
        }, [loops, gameState]);

    useEffect(() => {
        if (loops >= 5) {
          setGameState('over');
        }
      }, [loops]);

    console.log(word);
    console.log(loops);

    const handleSubmit = () => {  //called when submit button is pressed
        let config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: `http://localhost:3000/guess?guess=${guess}&unscrambled=${word}`, //guess from 
            //input and word from useEffect
            headers: { }
          };
          
        axios.request(config)
            .then((response) => {
                if(response.data === 'correct'){
                    notification.success({
                        message: "Correct!",
                        description: `You guessed the word "${word}" correctly!`,
                        placement: "topRight",
                        duration: 2
                    });
                    setLoops(loops+1); //increment the game loop counter
                    changeScore(10); //add 10 to score when right
                    setWord(''); //reset word
                } else{
                    notification.error({
                        message: "Incorrect!",
                        description: `Please try again!`,
                        placement: "topRight",
                        duration: 2
                    });
                    changeScore(-2);
                }
                setGuess("");
            })
            .catch((error) => {
                console.log(error);
            });
        setGuess("");
    };

    const giveHint = (typeofhint) => { //give user a hint
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

    const changeScore = (change) => {
        let config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: `http://localhost:3000/score?val=${change}`,
            headers: { }
          };
          
        axios.request(config)
        .then((response) => {
            setScore(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    };

    const changeGameState = () => {
        setGameState('playing');
        setLoops(0);
        setScore(0);

        let config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/score/reset',
            headers: { }
          };
          
        axios.request(config)
        .then((response) => {
            console.log('Score is reset');
        })
        .catch((error) => {
        console.log(error);
        });
    }

    return( 

        <div className = "card">
            {gameState === 'playing' && (
                <>
                <h2>Scrambled word: {scrambled}</h2>
                    <Input size='large' placeholder='Enter your guess'
                        onChange={(e) => setGuess(e.target.value)} value={guess}/> 
                    <br/> <br/>
                    <Button type='default' size='large' onClick={handleSubmit}>Submit</Button>

                    <FloatButton.Group shape="square">
                        <FloatButton icon={<QuestionCircleOutlined />} type='primary' 
                            tooltip = 'Click for the definition!' onClick={() => 
                                {giveHint('definition'); }}/>
                        <FloatButton icon={<BulbOutlined />} type='primary'
                            tooltip = 'Click for a synonym!' onClick ={() => 
                                {giveHint('synonym'); }}/>
                    </FloatButton.Group>
                <p>Score: {score}</p>
                </>
            )}

            {gameState === 'over' && (
                <div>
                    <h1>GAME OVER</h1>
                    <h2>Your final score is ... {score} out of a possible {loops*10}</h2>
                    <br/> <br/>
                    <Button type='default' size='large' shape = 'circle' onClick={changeGameState}>Play again!</Button>
                </div>
            )}
            
        </div>
    )
}

export default Game;