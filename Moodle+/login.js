console.log("Moodle+ successfully loaded!");
const login_element = document.querySelector(".loginpanel"); // Select login element
let login_text = login_element.innerText;
let arr = login_text.split(/\n/);

let question = arr[4]; // Get question from login_element
let question_arr = question.split(' ');
let numbers = question.match(/\d+/g);
let answer;
if (question.includes('add')){
    answer = parseInt(numbers[0])+parseInt( numbers[1]);
} else if (question.includes('subtract')) {
    answer = parseInt(numbers[0])-parseInt( numbers[1]);
} else if (question.includes('first')) {
    answer = numbers[0];
} else {
    answer = numbers[1];
}

const captcha_input_element = document.querySelector("#valuepkg3"); // Select input element
captcha_input_element.value = answer;
