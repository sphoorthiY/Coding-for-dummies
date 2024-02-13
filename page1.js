import {process} from "./env.js"

const chatArea1 = document.getElementById("chatconvo1")
const chatArea2 = document.getElementById("chatconvo2")
const convoArea1 = document.getElementById("convo1")
const convoArea2 = document.getElementById("convo2")
const inputTextArea = document.getElementById("inputTextArea")
const userReply = document.getElementById("whatsapp")
const sendBtn = document.getElementById("send-btn")

const OPENAI_API_KEY1 = process.env.OPENAI_API_KEY1
const OPENAI_API_KEY2 = process.env.OPENAI_API_KEY2

const url = "https://api.openai.com/v1/completions"
export var userInput = ""

sendBtn.addEventListener("click", () => {
    userInput = inputTextArea.value
    console.log("clicked")
    userReply.innerText = userInput
    userReply.style.display = 'flex'
    document.getElementById("blu").style.display = 'none'
    fetchInitialResponse(userInput)
    fetchResources(userInput)
})

async function fetchInitialResponse(userInput){
    const response = await fetchAPI(url,{
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "Authorization":"Bearer " + OPENAI_API_KEY1
        },
        body: JSON.stringify({
            'model':'text-davinci-003',
            'prompt':`Generate a message containing 5 initial steps for the user to learn the programming language
            mentioned in the prompt. Ensure that the responses are short, concise and easy to read. Begin with an 
            enthusiastic statment If there is no programming language specified then apologize and ask again.
            ###
            prompt: I wanna learn python
            message: Sure! Python is a versatile language and learning it will prove to be rewarding! Here are a few steps to begin:
            1.Install Python: Start by downloading python on your computer.
            2.Choose Learning Resources: Select learning resources that best suit your style!
            3.Learn the Basics: Begin with the fundamentals of python. Data types, variable, conditions, loops... There's plenty to learn!
            4.Hands-On Coding Projects: Not only python, learning any language is best learned through practice.
            5.Join the Python Community and Practice: Ask questions and learn, from forums such as GitHub. Regularly practice coding and 
            challenge yourself.
            ###
            prompt: ${userInput}
            message:
            `,
            'max_tokens': 600,
            'temperature': 0.5
        })
    })
    const data = await response.json()
    setTimeout(() => {
        console.log(`Entered display 1: ${userInput}`)
        chatArea1.style.display = 'flex'
        convoArea1.innerText = data.choices[0].text
    }, 1000)
}

async function fetchResources(userInput){
    const response = await fetchAPI(url, {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "Authorization":"Bearer " + OPENAI_API_KEY2
        },
        body: JSON.stringify({
            'model':'text-davinci-003',
            'prompt':`Generate a list of 5 online resources for the user to learn the programming language mentioned in prompt
            If there is no programming language mentioned, apologize and ask them to try again.
            Give the final response in the format resource_name: resource_link.
            ###
            prompt: I wanna learn python
            message: Here are a few resources to begin your python journey:
            1.Stack Overflow: https://stackoverflow.com
            2.Geeks for Geeks: https://www.geeksforgeeks.org
            3.SourceForge: https://sourceforge.net
            4.W3Schools: https://w3schools.com
            5.Coursera: https://www.coursera.org
            ###
            prompt: ${userInput}
            message:
            `,
            'max_tokens': 600,
            'temperature': 0.4
        })
    })
    const data = await response.json()
    setTimeout(()=>{
        console.log("Entered Display 2")
        chatArea2.style.display = 'flex'
        convoArea2.innerText = data.choices[0].text
    }, 1000)
}

async function fetchAPI(url, options) {
    const response = await fetch(url, options);
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After')) || 1;
      await sleep(retryAfter * 1000);
      return fetchAPI(url, options);
    }
    return response;
}
  
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}