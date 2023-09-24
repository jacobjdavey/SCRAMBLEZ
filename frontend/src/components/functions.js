const URL = "http://localhost:4000";

export async function getScrambledWord(){
    const response = await fetch(`${URL}/scrambled_word`);
    return await response.text();
}

export async function guess(guess,unscrambled){
    const response = await fetch(`${URL}/guess?guess=${guess}&unscrambled=${unscrambled}`);
    return await response.text();
}

export async function getHint(unscrambled, hintType){
    const response = await fetch(`${URL}/guess/hint?unscrambled=${unscrambled}&
    hintType=${hintType}`);
    return await response.text();
}

export async function getScore(){
    const response = await fetch(`${URL}/score`);
    return await response.text();
}

