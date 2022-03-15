const http = require("http");

const hostname = '127.0.0.1';
const port = process.env.PORT || 8080;;

const SECRET = "CIGAR"; 

function myFunction(req, res) {
	
	if (req.url.includes('wordle')){		//check for valid request
		const GUESS = req.url.split('?q=')[1];
		
		const feedback = compare(GUESS.toUpperCase()); 
		res.write(feedback);
		res.end();
	}
	
}

const server = http.createServer(myFunction)

function callback(){
	console.log(`Server running at http://${hostname}:${port}/`);
}

function compare(guess){		//returns feedback string
	secret_arr = SECRET.split('');
	console.log(guess);
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