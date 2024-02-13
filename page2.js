import { process } from "./env.js";

const inputTextArea = document.getElementById("inputTextArea");
const programTextArea = document.getElementById("programTextArea");
const convoArea = document.getElementById("convo");
const genBtn = document.getElementById("gen-btn");
const subBtn = document.getElementById("sub-btn");

const OPENAI_API_KEY3 = process.env.OPENAI_API_KEY3;
const OPENAI_API_KEY4 = process.env.OPENAI_API_KEY4;
var problemstatement = "";

const url = "https://api.openai.com/v1/completions";

genBtn.addEventListener("click", () => {
  const userInput = programTextArea.value;
  fetchProblemStatement(userInput);
});

subBtn.addEventListener("click", () => {
  const userCode = inputTextArea.value;
  document.getElementById("convoChat").style.display = "none";
  checkProblemStatement(userCode);
});

async function fetchProblemStatement(userInput) {
  const response = await fetchAPI(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + OPENAI_API_KEY3,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: `Generate a beginner level program problem statment using the language described as in "${userInput}" `,
      max_tokens: 100,
      temperature: 0.8,
    }),
  });
  const data = await response.json();
  setTimeout(function () {
    problemstatement = data.choices[0].text;
    convoArea.innerText = data.choices[0].text;
  }, 1000);
}

async function checkProblemStatement(userCode) {
  const response = await fetchAPI(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + OPENAI_API_KEY4,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: `Read the user code: "${userCode}" and check for any errors and also it must be in accordance and correctly give the output if executed
      with the problem statement "${problemstatement}" and if not in accordance give a brief explanation `,
      max_tokens: 500,
      temperature: 0.4,
    }),
  });
  const data = await response.json();
  setTimeout(function () {
    convoArea.innerText = data.choices[0].text;
  }, 1000);
}

async function fetchAPI(url, options) {
  const response = await fetch(url, options);
  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get("Retry-After")) || 1;
    await sleep(retryAfter * 1000);
    return fetchAPI(url, options);
  }
  return response;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
