var cnt;
var currCell;
var data;
var dataCopy;
var bestGuess = [];
var noMatches = new Set();
var partialMatches = [new Set(), new Set(), new Set(), new Set(), new Set()];

function input(event) {   
    if (event.key === "Backspace" && cnt > 0) {
        // if backspace and it's not first cell
        // decrement and delete text in that cell
        cnt--;
        currCell = dataCopy[cnt];
        currCell.textContent = "";
        currCell.classList.remove("selected");

    } else if (event.key ==="Enter" && cnt === 5) { 
        // if submitting the word, check for win and proceed accordingly
        let matches = checkWord(dataCopy.slice(0, 5));
        // if not a word
        if (matches.length == 0) {
            return;
        }
        updateBestGuess(matches);
        updateBoard(matches, dataCopy.slice(0, 5));
        if (checkWin(matches)) {
            endGame(true);
            // stop allowing input
            cnt = 0;
            dataCopy = dataCopy.slice(0,0); 
        // if  last row
        } else if (dataCopy.length === 5) {
            endGame(false);
            cnt = 0; 
            dataCopy = dataCopy.slice(0,0); 
        } else {
            // move to next row
            dataCopy = dataCopy.slice(5, dataCopy.length);
            cnt = 0;
        }
    } else if (isAlphaChar(event.key) && cnt < 5) {
        // if the key press is alphabetical and within the current row,
        // add it to the grid 
        currCell = dataCopy[cnt];
        currCell.textContent += event.key.toUpperCase();
        currCell.classList.add("selected");
        cnt++;
    }
}

function checkWord(word) {
    let solutionArr = solution.split("");
    let matches = []; // 1 is green, 0 is yellow, -1 is grey

    wordStr = "";
    word.forEach(word => wordStr += word.innerText);

    easy = document.getElementById("easyMode").checked;


    // if it's not a word, reject input and tell user
    if (!wordList.includes(wordStr.toLowerCase())) {
        if (easy) {
            document.getElementById("result").innerText = "Not a valid word, try again. You could try: " + suggestAnswers() + ".";
        } else {
            document.getElementById("result").innerText = "Not a valid word, try again.";
        }
        setTimeout(() => {document.getElementById("result").innerText = ""}, 3000);
        return matches;
    }
    // multiple loops to handle the case of repeat characters in guess / answer
    // delete matching chars and handle undefined so length doesn't change and indices match
    // check for total successes
    for (i = 0; i < word.length; i++) {
        if (i === solutionArr.indexOf(word[i].innerText.toLowerCase())) {
            matches[i] = 1;
            // remove partialMatches since they're now full matches
            // TODO: fix this
            // if the letterArr includes the letter, remove that letter
            for (j = 0; j < partialMatches.length; j++) {
                partialMatches[j].delete(word[i].innerText.toLowerCase());
            }
            // partialMatches.filter((letterArr) => {return letterArr.includes(word[i].innerText)});
            delete solutionArr[i];
            delete word[i];
        }
    }
    // check for partial successes
    for (i = 0; i < word.length; i++) {
        if (word[i] !== undefined &&  solutionArr.indexOf(word[i].innerText.toLowerCase()) !== -1) {
            matches[i] = 0;
            // update partial matches
            // TODO change partialMatches
            partialMatches[i].add(word[i].innerText.toLowerCase());
            delete solutionArr[solutionArr.indexOf(word[i].innerText.toLowerCase())];
            delete word[i];
        }
    }
    for (i = 0; i < word.length; i++) {
        if (word[i] !== undefined) {
            matches[i] = -1;
            // keep track of letters found that aren't part of the solution
            noMatches.add(word[i].innerText.toLowerCase());
        }
    }
    return matches;
}

function updateBoard(matches, currRow) {
    
    for (i = 0; i < matches.length; i++) {
        color = "";
        let currAlpha = document.getElementById(currRow[i].innerText);
        if (matches[i] === 1) {
            // green
            color = "green";
        } else if (matches[i] == 0) {
            // yellow
            color = "yellow";
        } else {
            // grey
            color = "grey";
        }
        // only update alphabet color when it's an 'upgrade'
        // grey -> yellow -> green
        currAlphaClassName = currAlpha.className;
        if (currAlphaClassName === "letter") {
            currAlpha.classList.add(color);
        } else if (color === "green" && (currAlphaClassName === "letter yellow" || 
                                        currAlphaClassName === "letter grey")) {
            currAlpha.className = "letter green";
        } else if (color === "yellow" && currAlphaClassName === "letter grey") {
            currAlpha.className = "letter yellow";
        }
        currRow[i].className = "cell " + color;
    }
}

function checkWin(matches) {
    // true is win, false is lose
    for (i = 0; i < matches.length; i++) {
        if (matches[i] !== 1) {
            return false;
        }
    }
    return true;
}

function endGame(result) {
    let display = document.getElementById("result"); 
    // if it's a win
    if (result) {
        // add to stats storage
        guessNum = 7 - (dataCopy.length / 5);
        let currGuessCount = parseInt(localStorage.getItem("guessCnt" + guessNum)) + 1;
        localStorage.setItem("guessCnt" + guessNum, currGuessCount);
        display.innerText = "YOU WIN!"
    } else {
        display.innerText = "The correct word was: " + solution.toUpperCase();
    }
    let currGamesPlayed = parseInt(localStorage.getItem("gamesPlayed")) + 1;
    localStorage.setItem("gamesPlayed", currGamesPlayed);
    // update stats with new data
    updateStats();
}

function reset() {
    // reset everything that can change to its default value
    data = Array.from(document.getElementsByClassName("cell"));
    data.forEach((cell) => {cell.innerText = ""; cell.className = "cell"});
    alpha = Array.from(document.getElementsByClassName("letter"));
    alpha.forEach((letter) => {letter.className = "letter"});
    dataCopy = data.slice();
    currCell = null;
    cnt = 0;
    solution = getRandomWord(wordList);
    document.getElementById("result").innerText = "";
    noMatches.clear();
    for (let i = 0; i < partialMatches.length; i++) {
        partialMatches[i].clear();
    }
    bestGuess = [];
}

function getRandomWord(wordList) {
    let randInt = getRandomInt(0, wordList.length);
    return wordList[randInt];
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function isAlphaChar(str) {
    if (str.length === 1) {
        // only alpha chars have a different upper AND lower case
        return str.toUpperCase() != str.toLowerCase();
    }
    return false;
}

function updateStats() {
    let winCnt = 0;
    playedElem = document.getElementById("played");
    gamesPlayed = localStorage.getItem("gamesPlayed");
    percentage = document.getElementById("percentage");
    distribution = document.getElementById("distribution");
    playedElem.innerText = parseInt(gamesPlayed) + "\nPlayed\t";
    distribution.innerText="";
    // iterate through the guess distribution and update
    for (i = 1; i <= 6; i++) {
        distributionCnt = parseInt(localStorage.getItem("guessCnt" + i));
        distribution.innerText += i + ": " + parseInt(distributionCnt) + "\n";
        winCnt += distributionCnt;
    }
    // gamesPlayed == 0 means divide by 0
    if (gamesPlayed == 0) {
        percentage.innerText = 0 + "\nWin %";
    } else {
        percentage.innerText = Math.round(winCnt/gamesPlayed * 100) + "\nWin %";
    }
    
}

function updateBestGuess(matches) {
    // computer knows the solution and matches corresponds to the letters of solution
    // use that info to provide suggestions
    for (let i = 0; i < 5; i++) {
        if (bestGuess[i] === -1 && (matches[i] === 1 || matches[i] === 0)) {
            bestGuess[i] = matches[i]; 
        } else if (bestGuess[i] === 0 && matches[i] === 1) {
            bestGuess[i] = matches[i];
        } else if (bestGuess.length !== 5) {
            bestGuess[i] = matches[i];
        }
    }
}

function suggestAnswers() {
    ansArr = lexicon.suggestAnswer(solution, bestGuess, noMatches, partialMatches, lexicon.root, "", 0, []);
    ret = "";
    if (ansArr.length <= 3) {
        for (i = 0; i < ansArr.length; i++) {
            ret += ansArr[i] + ", ";
        }
        ret = ret.substring(0, ret.length - 2);
    } else {
        retSet = new Set();
        while (retSet.size < 3) {
            retSet.add(ansArr.get(getRandomInt(0, ansArr.length)));
        }
        for (const word of retSet) {
            ret += word + ", ";
        }
        ret = ret.substring(0, ret.length - 2);
    }
    return ret;
}