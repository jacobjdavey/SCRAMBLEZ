import { useState, useEffect } from 'react';
import { Input, Button, notification } from 'antd';
import axios from 'axios';

function Game () {

    const [word, setWord] = useState("hello");
    const [score, setScore] = useState(0);
    const [guess, setGuess] = useState("");

    useEffect(() => { 
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/getWord',
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
        url: `http://localhost:3000/guessWord?word=${guess}`,
        headers: { }
        };
        
        axios.request(config)
            .then((response) => {
                if(response.data === true) {
                    setScore(score + 1);
                    notification.success({
                        message: "Correct!",
                        description: "You guessed the word correctly!",
                        placement: "bottomRight",
                        duration: 2
                    });
                } else {
                    notification.error({
                        message: "Inorrect!",
                        description: "You guessed the word incorrectly!",
                        placement: "bottomRight",
                        duration: 2
                    });
                }
                setGuess("");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return <div className="card">
        <h2> Current Word: {word} </h2>
        <Input size="large" placeholder="Enter your guess"
            onChange={(input) => {setGuess(input.target.value); }}
            value={guess} />
        <br /> <br />
        <Button type="primary" size="large" onClick={handleSubmit}>Submit</Button>
        <p> Score: {score} </p>
    </div>
    
    
}

export default Game;