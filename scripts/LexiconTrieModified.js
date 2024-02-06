class LexiconTrieModified {

    root;
    numWords;

    // WRITE CONTAINS

    /**
     * Initializes a LexiconTrie
     */
    constructor() {
        this.root = new LexiconNode(' ', false);
        this.numWords = 0;
        this.suggestions = [];
    }

    /**
     * Adds a word to the LexiconTrie
     * 
     * @param {str} word the word to be added 
     * @returns true if a word was added, false if it wasn't
     */
    addWord(word) {
        let ret = this.addWordHelper(word, this.root);
        if (ret) {
            this.numWords++;
        }
        return ret;
    }

    /**
     * Helper function for recursion when adding a word
     * 
     * @param {str} word the word to be added 
     * @param {LexiconNode} treeHead the parent of the child to be added  
     * @returns true if a word was added, false if it wasn't
     */
    addWordHelper(word, treeHead) {
        word = word.toLowerCase();
        let letter = word.charAt(0);
        let childNode = treeHead.getChild(letter);
        if (childNode !== null) {
            if (word.length > 1) {
                return this.addWordHelper(word.substring(1), childNode);
            }
            if (childNode.isWord) {
                return false;
            }
            childNode.isWord = true; 
            return true;
        } // if the childNode doesn't exist and this isn't the last letter
        if (word.length > 1) {
            let newChildNode = new LexiconNode(letter, false);
            treeHead.addChild(newChildNode);
            return this.addWordHelper(word.substring(1), newChildNode);
        }
        // if (childNode == null && word.length() < 1)
        treeHead.addChild(new LexiconNode(letter, true));
        return true;
    }

    /**
     * @returns the number of words in the trie
     */
    numWords() {
        return this.numWords;
    }


    /**
     * NOTE: This functions, but it is a WIP
     * 
     * Suggests possible answers from the word list based on what's been guessed
     * 
     * @param {str} solution 
     * @param {int[]} bestGuess 
     * @param {int[]} noMatches 
     * @param {Set[]} partialMatches 
     * @param {LexiconNode} treeHead 
     * @param {str} prevString 
     * @param {int} level 
     * @param {str[]} ret 
     * @returns an array of possible answers to the puzzle
     */
    suggestAnswer(solution, bestGuess, noMatches, partialMatches, treeHead, prevString, level, ret) {
        if (level === 5) {
            // prevString needs to contain all remaining partial letters
            let successCnt = 0;
            let partialLettersArr = [];
            for (i = 0; i < partialMatches.length; i++) {
                for (const letter of partialMatches[i]) {
                    partialLettersArr.push(letter);
                }
            } for (i = 0; i < partialLettersArr.length; i++) {
                if (prevString.includes(partialLettersArr[i])) {
                    successCnt++;
                }
            }
            if (successCnt >= partialLettersArr.length) {
                ret.push(prevString);
            }
        } else {
            if (bestGuess[level] === 1 && treeHead.getChild(solution.charAt(level)) !== null) {
                let newHead = treeHead.getChild(solution.charAt(level));
                let newString = prevString + solution.charAt(level);
                let newLevel = level + 1;
                this.suggestAnswer(solution, bestGuess, noMatches, partialMatches, newHead, newString, newLevel, ret);
            }  else if (bestGuess[level] === 0) {
                let validChildren = treeHead.children.filter((childNode) => {return !noMatches.has(childNode.letter) && 
                                                                                !partialMatches[level].has(childNode.letter)});
                for (let i = 0; i < validChildren.length; i++) {
                    let newHead = treeHead.getChild(validChildren[i].letter);
                    let newString = prevString + validChildren[i].letter;
                    let newLevel = level + 1;
                    this.suggestAnswer(solution, bestGuess, noMatches, partialMatches, newHead, newString, newLevel, ret);
                }
            } 
            else if (bestGuess[level] === -1 || bestGuess.length === 0) {
                let validChildren = treeHead.children.filter((childNode) => {return !noMatches.has(childNode.letter) && 
                                                                                 !partialMatches[level].has(childNode.letter)})
                for (let i = 0; i < validChildren.length; i++) {
                    let newHead = treeHead.getChild(validChildren[i].letter);
                    let newString = prevString + validChildren[i].letter;
                    let newLevel = level + 1;
                    this.suggestAnswer(solution, bestGuess, noMatches, partialMatches, newHead, newString, newLevel, ret);
                }
            }
        }
        return ret;
    }

}