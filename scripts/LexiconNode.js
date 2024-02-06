class LexiconNode {

    letter;
    isWord;
    children;

    /**
     * 
     * @param {char} letter the letter that this node represents
     * @param {boolean} isWord true if this node represents the end of a word
     */
    constructor(letter, isWord) {
        this.letter = letter;
        this.isWord = isWord;
        this.children = [];
    }

    /**
     * 
     * @param {LexiconNode} o the other LexiconNode to compare to 
     * @returns < 0 if this node is lexicographically earlier, 0 if equal,
     *          > 0 if later
     */
    compareTo(o) {
        return this.letter.charCodeAt(0) - o.letter.charCodeAt(0);
    }

    /**
     * Adds a child lexiconNode to the appropriate position in the 
     * child data structure
     * @param {LexiconNode} ln a child LexiconNode 
     */
    addChild(ln) {
        // if ln is less than an existing child, put it in its place
        for (let i = 0; i < this.children.length; i++) {
            if (ln.compareTo(this.children[i]) < 0) {
                this.children.splice(i, 0, ln);
                return;
            }
        }
        // else, add it to the end
        this.children.push(ln);
    }

    /**
     * Returns the LexiconNode corresponding to the given child character
     * or null if no such child exists
     * @param {char} ch a character 
     * @returns A LexiconNode or null
     */
    getChild(ch) {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].letter === ch) {
                return this.children[i];
            }
        }
        return null;
    }


    /**
     * Removes the child associated with the given character
     * Does nothing if the child does no exist
     * @param {ch} ch a character 
     */
    removeChild(ch) {
        this.children.filter((child) => {child.letter === ch});
    }

}