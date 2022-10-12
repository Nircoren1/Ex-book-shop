'use strict'

const PAGE_SIZE = 8;
const MAX_PRICE = 300;
const DB_BOOKS = 'Books';
const DB_LAYOUT_TYPE = 'layoutType';
const DB_MODAL = 'modalId';

var gPageIdx = 0;
var gBooks;
var gFilterBy = {
    maxPrice: 300,
    minRate: 0,
    txt: ''
}
var gModalId = loadFromStorage(DB_MODAL);
var gFavLayout = loadFromStorage(DB_LAYOUT_TYPE) ? loadFromStorage(DB_LAYOUT_TYPE) : 'grid';

_createBooks()
function _createBooks() {
    var books = loadFromStorage(DB_BOOKS);
    if (!books || !books.length) {
        let i = 0;
        books = []
        for (let i = 0; i < 20; i++) {
            books.push({
                id: i,
                name: makeLorem(1),
                price: 10.05,
                imgUrl: `./img/book${i}.jpg`,
                rate: 10,
                bookContent:makeLorem()
            })   
        }
    }
    gBooks = books;
    saveToStorage(DB_BOOKS, gBooks);
}

function getGBooks() {
    return gBooks;
}

function getGfilterBy() {
    return gFilterBy;
}
function setGfilterBy(obj) {
    return gFilterBy = obj;
}

function getModalId() {
    return gModalId;
}

function getPAGE_SIZE() {
    return PAGE_SIZE;
}

function getMAX_PRICE() {
    return MAX_PRICE;
}

function getGpageIdx() {
    return gPageIdx;
}

function setGpageIdx(value) {
    return gPageIdx = value;
}

function setGModalId(modalId) {
    saveToStorage(DB_MODAL, modalId);
    gModalId = +modalId;
}

function getBooks() {
    const books = gBooks.filter(book => book.price <= gFilterBy.maxPrice && book.rate >=
        gFilterBy.minRate && book.name.includes(gFilterBy.txt));
    const startIdx = gPageIdx * PAGE_SIZE;
    return books.slice(startIdx, startIdx + PAGE_SIZE);
}

function getBookValue(bookId, key) {
    return gBooks.find(book => {
        return +book.id === +bookId
    })[key];

}

function updateRate(bookId, num) {
    let bookRate = gBooks.find(book => book.id === bookId);
    if (bookRate['rate'] + num < 0 || bookRate['rate'] + num > 10) return;
    bookRate['rate'] += num;
    saveToStorage(DB_BOOKS, gBooks);
}

function updateBook(bookId, value, key) {
    gBooks.find(book => book.id === bookId)[key] = value
    saveToStorage(DB_BOOKS, gBooks);
}

function removeBook(bookId) {
    var deletedBookIdx = gBooks.findIndex(book => book.id === bookId);
    gBooks.splice(deletedBookIdx, 1);
    saveToStorage(DB_BOOKS, gBooks);
    if (bookId === gModalId) setGModalId(-1);
}

function addBook(name, price) {
    gBooks.push({
        id: gBooks[gBooks.length - 1].id + 1,
        name: name,
        price: +price,
        imgUrl: '../../img/book.webp',
        rate: 0
    });
    saveToStorage(DB_BOOKS, gBooks);
}

function setBookFilter(filterBy = {}) {
    if (filterBy.maxPrice !== undefined) {
        gFilterBy.maxPrice = filterBy.maxPrice
    };
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate;
    if (filterBy.txt !== undefined) gFilterBy.txt = filterBy.txt;
    return gFilterBy;
}

function updateLayout(layoutType) {
    saveToStorage(DB_LAYOUT_TYPE, layoutType);
    gFavLayout = layoutType;
}

function getLayoutType() {
    return gFavLayout;
}

function setBooksSort(sortBy = {}) {
    if (sortBy.price !== undefined) {
        gBooks.sort((b1, b2) => b1.price - b2.price);
    } else if (sortBy.name !== undefined) {
        gBooks.sort((b1, b2) => b1.name.localeCompare(b2.name));
    }
}
