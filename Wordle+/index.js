const http = require("http");
var fs = require("fs");

const port = process.env.PORT || 8080;

const wordData = fs.readFileSync("wordList.txt");
const wordArr = wordData.toString().split("\r\n")	//split by "\r\n" for windows and "\n" for linux(heroku)
const LENGTH = wordArr.length

function myFunction(req, res) {
	
	if (req.url.includes('wordle')){		//check for valid request
		const GUESS = req.url.split('?q=')[1];
		const word_id = req.url.split('?q=')[2];
		const SECRET = wordArr[parseInt(word_id)%LENGTH];
		const feedback = compare(GUESS.toUpperCase(),SECRET.toUpperCase()); 
		res.write(feedback);
		res.end();
	}
	else{
		const error_str = 'Wrong URL'
		res.write(error_str);
		res.end();
	}

}

const server = http.createServer(myFunction)

function callback(){
	console.log('Server running');
}

function compare(guess,SECRET){		//returns feedback string
	secret_arr = SECRET.split('');
	guess_arr = guess.split('');

	feedback_arr = []
	
	for (let i=0; i<5;i++){
		if (secret_arr[i]==guess_arr[i]){
			feedback_arr[i] = 'G';
		}else if (secret_arr.includes(guess_arr[i])){
			feedback_arr[i] = 'Y';
		}else{
			feedback_arr[i] = 'B';
		}
	}

	return feedback_arr.join('');
}


server.listen(port,hostname,callback);