
function makeLorem(wordCount = 50) {
    const words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    const wordsHeb = [' השמיים', ' מעל', ' נמל', ' היה', ' צבע הטלוויזיה', ' מכוון', 'ל', ' ערוץ מת', ' .', ' כל', ' זה קרה', ' פחות או יותר', ' .', ' אני', ' היה', ' הסיפור', ' לאט לאט', ' מהרבה אנשים', 'ו', ' בכללי', ' קורה', ' במקרים כאלו', ' כל הזמן', ' זה', ' היה', ' סיפור שונה', '.', ' זה', ' היה', ' עונג', 'ל', ' לשרוף']
    var txt = ''
    var txtHeb = ''
    while (wordCount > 0) {
        wordCount--;
        const randIdx = Math.floor(Math.random() * words.length)
        txt += words[randIdx] + ' '
        txtHeb += wordsHeb[randIdx]
    }
    return {en:txt,he:txtHeb};
}

function resetBooks() {
    gBooks = null;
    localStorage.clear()
}

function formatCurrencyISR(num) {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(num);
}
function formatCurrencyUSD(num) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
}