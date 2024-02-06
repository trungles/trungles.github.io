var solution;
var wordList = JSON.parse(localStorage.getItem("words"));
var lexicon = new LexiconTrieModified();

document.addEventListener("DOMContentLoaded", onLoad);

async function onLoad() {
    // if this is the first time loading, set valid wordList and localStorage
    if (localStorage.getItem("runBefore") === null) {
        localStorage.setItem("runBefore", true);

        // read in words
        const data = await fetch("./assets/five-letter-words.txt");
        const text = await data.text();
        wordList = text.split("\n");
       
        localStorage.setItem("words", JSON.stringify(wordList));
        localStorage.setItem("guessCnt1", 0);
        localStorage.setItem("guessCnt2", 0);
        localStorage.setItem("guessCnt3", 0);
        localStorage.setItem("guessCnt4", 0);
        localStorage.setItem("guessCnt5", 0);
        localStorage.setItem("guessCnt6", 0);
        localStorage.setItem("gamesPlayed", 0);
    }
    // set everything up
    reset();
    updateStats();
    for (let i = 0; i < wordList.length; i++) {
        lexicon.addWord(wordList[i]);
    }
    document.addEventListener("keydown", input);
    document.getElementById("reset").addEventListener("click", () => {reset(); document.getElementById("reset").blur()});
    let lettersArr = Array.from(document.getElementsByClassName("letter"));
    for (i = 0; i < lettersArr.length; i++) {
        let currLetter = lettersArr[i].id;
        let currElement = lettersArr[i];
        currElement.addEventListener("click", () => {document.dispatchEvent(new KeyboardEvent("keydown", {key : currLetter})); currElement.blur();});
    }
}