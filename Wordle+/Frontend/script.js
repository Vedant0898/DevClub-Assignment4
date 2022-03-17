createSquares();

const keys = document.querySelectorAll(".keyboard-row button");
const colors = {
    'B': '#8d9296',
    'Y': '#ded228',
    'G': '#23de27'
}


let feedback = "";
let currentGuessedWord = "";
let currentSquareID = 1;
let currentGuessNo = 1;
let gameOver = false;
let word_id = Math.floor(Math.random()*100000);

const url = 'https://wordle-vedant.herokuapp.com/wordle?q='
var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };


for (let i = 0; i < keys.length; i++) {
    keys[i].onclick = ({target})=> {
        const key = target.getAttribute("id");

        console.log(key);
        if (key=='DEL'){
            
            if(currentSquareID>5*(currentGuessNo-1)+1 && !gameOver){
                currentGuessedWord = currentGuessedWord.slice(0,-1);
                currentSquareID-=1;
                const currentSquareEl = document.getElementById(String(currentSquareID));
                currentSquareEl.textContent = "";
            }
            // console.log(currentSquareID);
            
        }
        else if (key=='ENTER'){
            if (currentGuessedWord.length != 5 && !gameOver){
                window.alert("Word must be 5 letter")
            }
            else if (!gameOver){
                console.log('Valid Word:',currentGuessedWord);
                checkCurrentWord(currentGuessedWord);
                
                // if (currentGuessNo<6){
                //     currentGuessNo+=1;
                //     currentGuessedWord="";
                // }
                // else{
                //     gameOver = true;
                //}
                
            }
        }
        else{
            if (currentSquareID<=5*currentGuessNo && !gameOver){
                currentGuessedWord+=String(key);
                const currentSquareEl = document.getElementById(String(currentSquareID));
                currentSquareEl.textContent = key;
                currentSquareID+=1;
            }
            
        }


    }
    
}

async function checkCurrentWord(guessedWord){
    let extension = guessedWord; 
    const extension2 = "?q="+word_id.toString();
    fetch(url+extension+extension2, requestOptions)
        .then(response => response.text())
        .then(result => updateColors(result,guessedWord))
        .catch(error => console.log('error', error));;
}

function updateColors(response,guessedWord){
    //updates colors of board square and keyboard
    feedback = response;
    //console.log("f:", feedback);
    feedback_arr = feedback.split('');
    guessedWord_arr = guessedWord.split('');
    index = 5*(currentGuessNo-1)+1
    console.log("arr",feedback_arr)
    // for (const letter of feedback_arr) {
    //     tileColor = colors[letter];
    //     squareEl = document.getElementById(String(index));
    //     squareEl.style.backgroundColor = tileColor;
    //     index+=1;
    // }

    for (let i = 0; i < 5; i++) {
        tileColor = colors[feedback_arr[i]];
        keyboardEl = document.getElementById(guessedWord_arr[i]);
        squareEl = document.getElementById(String(index));
        keyboardEl.style.backgroundColor = tileColor;
        squareEl.style.backgroundColor = tileColor;
        index+=1;
    }

    if (currentGuessNo<=6){
        currentGuessNo+=1;
        currentGuessedWord="";
    }
    else if (currentGuessNo>6 && feedback!="GGGGG"){
        setTimeout(function(){
            window.alert("Sorry, you have no more guesses!");
        },500)
        
        gameOver = true;
    }


    if (feedback=="GGGGG"){
        setTimeout(function(){
            window.alert("Congratulations you guessed the word correctly in "+ String(currentGuessNo-1) +" guesses");

        },750);
        gameOver = true;
    }
    
}



function createSquares(){
    const gameBoard = document.getElementById("board");

    for (let index = 0; index < 30; index++) {
        let square = document.createElement("div");
        square.classList.add("square");
        square.setAttribute("id",index+1);
        gameBoard.appendChild(square);
        
    }
}