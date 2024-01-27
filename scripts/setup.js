var solution;
var wordList = JSON.parse(localStorage.getItem("words"));

document.addEventListener("DOMContentLoaded", onLoad);

async function readFile(url) {
    const data = await fetch(url);
    const text = await data.text();
    return text.split("\n");

}

async function onLoad() {
    // if this is the first time loading, set valid wordList and localStorage
    if (localStorage.getItem("runBefore") === null) {
        localStorage.setItem("runBefore", true);
        wordList = await readFile("./assets/five-letter-words.txt");
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
    document.addEventListener("keydown", input);
    document.getElementById("reset").addEventListener("click", reset);
    let lettersArr = Array.from(document.getElementsByClassName("letter"));
    for (i = 0; i < lettersArr.length; i++) {
        let currLetter = lettersArr[i].id;
        lettersArr[i].addEventListener("click", () => {input(new KeyboardEvent("keydown", {key : currLetter}))});
    }
}
