const textArea = document.getElementById("input");
const boldButton = document.getElementById("bold");

let startPosition = 0;
let endPosition = 0;
let equation = "";
let formattedEquation = ""
let insideQuotes = false;
let isBold = false;


textArea.addEventListener("input", function() {
    const currentPlace = textArea.selectionStart;
    const text = textArea.value;

    let currentIndex = currentPlace - 1;
    if (currentIndex < 0) {
        return;
    }

    let currentChar = text[currentIndex];

    if (currentChar == '"' && insideQuotes == false) {
        insideQuotes = true;
        startPosition = currentIndex;
        return
    } 
    
    if (currentChar == '"' && insideQuotes == true) {
        insideQuotes = false;
        endPosition = currentIndex +1;
        equation = text.slice(startPosition + 1, endPosition - 1);
        formattedEquation = findWords(equation);
        console.log(formattedEquation);
        textArea.value = text.slice(0, startPosition) + formattedEquation + text.slice(endPosition);
        equation = "";
    }
    

} )

boldButton. addEventListener("click", function () {
    let start = textArea.selectionStart;
    let end = textArea.selectionEnd;
    let selectedText = textArea.value.substring(start, end);
    const startBoldTags = "<b>";
    const endBoldTags = "</b>";

    if (start != end) {
        if (isBold == false) {
            let formattedText = startBoldTags + selectedText + endBoldTags;
            textArea.value = textArea.value.slice(0, start) + formattedText + textArea.value.slice(end);
            textArea.selectionStart = start + formattedText.length;
            textArea.selectionEnd = textArea.selectionStart;
            isBold = !isBold;
        } else {
            let formattedText = "";
            formattedText = selectedText.replace("<b>", "").replace("</b>", "");
            console.log(formattedText);
            textArea.value = textArea.value.slice(0, start) + formattedText + textArea.value.slice(end);
            textArea.selectionStart = start + formattedText.length;
            textArea.selectionEnd = textArea.selectionStart;
            isBold = !isBold;
        }
    }
    textArea.focus();
})


// let text = "feso4 plus h20 equals fe03 plus h2";


function isAlphabet(chr) {
    if (chr >="A" && chr <= "Z") {
        return true
    } 
    
    if (chr >="a" && chr <= "z") {
        return true
    } 
}

function findWords(text) {
    let finalSentence = "";
    let word = "";
    for (let i = 0; i < text.length; i++) {
        if (text[i] == " ") {
            // detect space 
            // if word is plus replace it with +
            if (word.toLowerCase().trim() == "plus") {
                console.log(word)
                finalSentence += " + ";
            } else if (word.toLowerCase() == "equals") {
                finalSentence += " -> ";
            } else {
                let result = "";
                for (let i = 0; i < word.length; i++) {
                    if (isAlphabet(word[i])) {
                        result += word[i].toUpperCase();
                    } else {
                        result += word[i];
                    }
                }
                console.log(result, "result");
                finalSentence += result;
            }
            word = "";
         }
        else if (i == text.length - 1){
            let result=""
            if (isAlphabet(text[i])) {
                result += text[i].toUpperCase();
            } else {
                result += text[i];
            }

            if (isAlphabet(word)) {
                if ((word + result).toLowerCase() == "plus") {
                    console.log(word)
                    finalSentence += "+";
                } else if ((word + result).toLowerCase() == "equals") {
                    finalSentence += " -> ";
                } else {
                    finalSentence += word.toUpperCase() + result;
                }
            } else {
                finalSentence += word + result;
            }
        } else {
            word += text[i];
        }
    }
    return finalSentence;
}


function bolden() {

}