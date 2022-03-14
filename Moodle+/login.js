console.log("Moodle+ successfully loaded!");
const login_element = document.querySelector(".loginpanel"); // Select login element
let login_text = login_element.innerText;
let arr = login_text.split(/\n/);

let question = arr[4]; // Get question from login_element
let question_arr = question.split(' ');

let answer;
if (question.includes('add')){
    val_1 = parseInt(question_arr[2]);
    val_2 = parseInt(question_arr[4]);
    answer = val_1+val_2
} else if (question.includes('subtract')) {
    val_1 = parseInt(question_arr[2]);
    val_2 = parseInt(question_arr[4]);
    answer = val_1-val_2
} else if (question.includes('first')) {
    answer = question_arr[4];
} else {
    answer = question_arr[6];
}

const captcha_input_element = document.querySelector("#valuepkg3"); // Select input element
captcha_input_element.value = answer;
