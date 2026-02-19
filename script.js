const textArea = document.getElementById("input");
const instructions = document.getElementById("instructions");
const boldButton = document.getElementById("bold");
const helpButton = document.getElementById("help");

let startPosition = 0;
let endPosition = 0;
let equation = "";
let formattedEquation = ""
let insideQuotes = false;
let isBold = false;

let instructionsDisplay = false;

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
    await stream.write(textArea.innerHTML);
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

let openQuoteRange = null; 

function setCaretAfter(node) {
  const sel = window.getSelection();
  const range = document.createRange();

  range.setStartAfter(node);
  range.collapse(true);

  sel.removeAllRanges();
  sel.addRange(range);
}

textArea.addEventListener("input", (event) => {
  const charTyped = event.data;

  if (charTyped !== '"') return;

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const caretRange = sel.getRangeAt(0); 

  if (!insideQuotes) {

    insideQuotes = true;

    openQuoteRange = caretRange.cloneRange();
    openQuoteRange.setStart(caretRange.startContainer, Math.max(0, caretRange.startOffset - 1));
    openQuoteRange.setEnd(caretRange.startContainer, caretRange.startOffset);

    return;
  }

  
  insideQuotes = false;

  // Build a full range from the opening quote to the closing quote (inclusive).
  const fullRange = openQuoteRange.cloneRange();
  fullRange.setEnd(caretRange.endContainer, caretRange.endOffset); 
  const innerRange = fullRange.cloneRange();

  innerRange.setStart(openQuoteRange.endContainer, openQuoteRange.endOffset);
  innerRange.setEnd(caretRange.endContainer, Math.max(0, caretRange.endOffset - 1));

  const equationText = innerRange.toString(); // text between quotes

  const formattedHTML = formatEquation(equationText); 
  const frag = fullRange.createContextualFragment(formattedHTML);
  fullRange.deleteContents();

  
  const lastNode = frag.lastChild;
  fullRange.insertNode(frag);

  if (lastNode) setCaretAfter(lastNode);

  openQuoteRange = null;
});



// Notifications

// rules/ instruction notifications
setTimeout(() => {
    textArea.classList.add("unblur");
    helpButton.style.display = "block";
    closed();

}, 2900);


// instruction
function closed(){
    console.log("clicked")
    const instructions = document.getElementById("instructions");
    instructions.style.display = "none";
    instructionsDisplay = false;
}

function opened(){
    if (instructionsDisplay == false) {
        console.log("clicked")
        instructions.style.display = "block";
        instructionsDisplay = true;
    } else {
        closed();
    }
}

// format equation
function formatEquation(text) {
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
                    result += word[i].toUpperCase();

                }
                console.log(result, "result");
                finalSentence += result;
            }
            word = "";
         }
        else if (i == text.length - 1){
            let result=""
            result += text[i].toUpperCase();

            if ((word + result).toLowerCase() == "plus") {
                console.log(word)
                finalSentence += "+";
            } else if ((word + result).toLowerCase() == "equals") {
                finalSentence += " -> ";
            } else {
                finalSentence += word.toUpperCase() + result;
            }
        } else {
            word += text[i];
        }
    }
    return finalSentence;
}


textArea.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.shiftKey && event.code === "Digit8") {
        event.preventDefault();
        document.execCommand("insertUnorderedList");
    }

    if (event.ctrlKey && event.key === "ArrowUp") {
        event.preventDefault();
        document.execCommand("superscript");
    }

    if (event.ctrlKey && event.key === "ArrowDown") {
        event.preventDefault();
        document.execCommand("subscript");
    }
});
