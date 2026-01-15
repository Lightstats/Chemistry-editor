const textArea = document.getElementById("input");
const boldButton = document.getElementById("bold");

let startPosition = 0;
let endPosition = 0;
let equation = "";
let formattedEquation = ""
let insideQuotes = false;
let isBold = false;

// Accessing and saving file document

let fileHandle;

async function openFiles() {
   [fileHandle] = await window.showOpenFilePicker( {
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
   console.log(text);
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
    await stream.write(textArea.textContent);
    await stream.close();

    let saveNotif = document.getElementById("alert");
    saveNotif.style.display = "block";
    
    setTimeout(()=>{
        saveNotif.style.display = "none";
    }, 1300)

}


// Add subscript 

// formatting general text
function bolden() {
  document.execCommand("bold");
  console.log("has been bolden!");
}

function italicize() {
  document.execCommand("italic");
  console.log("Italicized!");
}



// Format according to chemistry

// Keep track of "" added to input
textArea.addEventListener("input", function() {
    const text = textArea.textContent;
    const place = getCaretIndex(textArea);

    const currentIndex = place - 1;

    if (currentIndex < 0) {
        return;
    }

    const currentChar = text[currentIndex];


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
        textArea.textContent = text.slice(0, startPosition) + formattedEquation + text.slice(endPosition);
        
        const newCaret = startPosition + formattedEquation.length;
        setCaretIndex(textArea, newCaret);
    }
    
}
);



// selected text

function getCaretIndex(el) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return 0;

  const range = sel.getRangeAt(0).cloneRange();
  range.selectNodeContents(el);
  range.setEnd(sel.getRangeAt(0).endContainer, sel.getRangeAt(0).endOffset);

  return range.toString().length;
}

function setCaretIndex(el, index) {
  const range = document.createRange();
  const sel = window.getSelection();

  let current = 0;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);

  let node = walker.nextNode();
  while (node) {
    const next = current + node.textContent.length;
    if (index <= next) {
      range.setStart(node, index - current);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      el.focus();
      return;
    }
    current = next;
    node = walker.nextNode();
  }

  // fallback: place at end
  el.focus();
}




// format equation input accordingly
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

function isAlphabet(chr) {
    if (chr >="A" && chr <= "Z") {
        return true
    } 
    
    if (chr >="a" && chr <= "z") {
        return true
    } 
}



// Notifications

// rules notifications
setTimeout(() => {
    textArea.classList.add("unblur");
}, 2000);
