const textArea = document.getElementById("input");
const boldButton = document.getElementById("bold");

let startPosition = 0;
let endPosition = 0;
let equation = "";
let formattedEquation = ""
let insideQuotes = false;
let isBold = false;

let fileHandle;


async function openFiles() {
   let [fileHandle] = await window.showOpenFilePicker( {
    types: [
      {
        description: "HTML or Text",
        accept: {
          "text/html": [".html"],
          "text/plain": [".txt"]
        }
      }
    ]
  });
   let fileData = await fileHandle.getFile();
   let text = await fileData.text();
   textArea.innerHTML = text;
}

async function saveAs() {
    fileHandle = await window.showSaveFilePicker({
    suggestedName: "Chemnotes.html",
    types: [
      {
        description: "HTML File",
        accept: { "text/html": [".html"] }
      },
      {
        description: "Text File",
        accept: { "text/plain": [".txt"] }
      }
    ]
  });
}

async function save() {
    if (!fileHandle) {
        await saveAs();
    }

    let stream = await fileHandle.createWritable();
    await stream.write(textArea.innerHTML);
    await stream.close();
}

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
    

} );

boldButton. addEventListener("click", function () {
    bolden();
});


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
    let selection = window.getSelection();
    if (selection.isCollapsed) {
        textArea.focus();
        return;
    }

    const range = selection.getRangeAt(0);

    const selectedText = range.extractContents();

    if (selectedText.length > 0) {
        if (isBold == false) {
            const boldTag = document.createElement("b");
            boldTag.appendChild(selectedText);
            range.insertNode(boldTag);
            console.log(selectedText);
            range.setStartAfter(boldTag);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            console.log(boldTag);
            isBold = !isBold
            
        } else {
            range.insertNode(selectedText);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);

            isBold = !isBold;
        }
    }

}