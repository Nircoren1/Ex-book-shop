'use strict'

var gMenuVisible = false;

function onInit() {
    renderFilterByQueryStringParams();
    renderBooks();
    renderModal(getModalByQueryStringParams());
    renderPageBtns();
}

function renderBooks() {
    const books = getBooks();

    if (getLayoutType() === 'grid') {
        renderBooksGrid(books);
    } else {
        renderTable(books);
    }
    if (books.length === 0) return document.querySelector('.books-container').innerHTML += `<h1 class="no-res-h1">No Result</h1>`
}

function renderTable(books) {
    const tableStr =
        `<div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th onclick="onSort({name:true})" class="sort-table-th" >Title</th>
                    <th onclick="onSort({price:true})" class="sort-table-th" >Price</th>
                    <th>Actions</th>            
                </tr>
            </thead>
            <tbody class="table-tbody"></tbody>
        </table>
    </div>`

    var tableBooksStr = '';
    books.map(book => {
        tableBooksStr += `<tr>`;
        for (const prop in book) {
            if (prop === 'rate' || prop === 'bookContent') continue;
            if (prop === 'imgUrl') {
                tableBooksStr += getBtnsStr(book.id);
                continue;
            }
            tableBooksStr += `<td>${book[prop]}</td>`
        }
        tableBooksStr += '</tr>';
    });
    tableBooksStr = tableBooksStr.slice(0, tableBooksStr.length - 10)
    document.querySelector('.books-container').innerHTML = tableStr;
    document.querySelector('.table-tbody').innerHTML = tableBooksStr;
}

function renderBooksGrid(books) {
    const leftSideBarStr =
        `
   
    
        <p class="sort-by-p">Sort By:<p/>
        <button onclick="onSort({name:true})">Title</button>
        <button onclick="onSort({price:true})">Price</button>
    `
    const gridBooksStr =
        `
    <div class="books-grid-container"> 
    ${books.map(book =>
            `<div class="book">
                <img src="${book.imgUrl}"  onerror="this.src = 'img/book${book.id % 7}.jpg'"></img>
                <div class="book-content-container">
                    <h5>${book.name}</h5>
                    <h5>$${book.price}</h5>
                </div>
                <div class="grid-btns-container">
                    ${getBtnsStr(book.id)}
                </div>
            </div>
   `
        ).join('')}
    </div>
    `
    document.querySelector('.books-container').innerHTML = gridBooksStr;
    document.querySelector('.sort-btns-container').innerHTML = leftSideBarStr;
}

function getBtnsStr(bookId) {
    return `<td><button onclick="onReadBook(${bookId})">Read</button></td>
            <td><button onclick="onUpdateBook(${bookId})">Update</button></td>
            <td><button onclick="onRemoveBook(${bookId})">Delete</button></td>`
}

function renderPageBtns() {
    const PAGE_SIZE = getPAGE_SIZE();
    let pageIdx = 0;
    let str = `<button onclick="onPaging(getGpageIdx()-1)" class="prev-page">&#60</button>`;
    let booksLength = getGBooks().length;
    while (pageIdx * PAGE_SIZE < booksLength) {
        str += `<button onclick=" onPaging(${pageIdx})" class="page-btn page-${pageIdx}">${pageIdx++ + 1}</button>`;
    }
    str += `<button onclick="onPaging(getGpageIdx()+1)" class="next-page">&gt</button>`;
    document.querySelector('.paging-container').innerHTML = str;
    switchPage(0);
}

function renderByQueryStringParams() {
    renderFilterByQueryStringParams();
}

function renderFilterByQueryStringParams() {
    const filterBy = setFilterByQueryStringParams();

    document.querySelector('.filter-price-range').value = filterBy.maxPrice;
    document.querySelector('.filter-rate-range').value = filterBy.minRate;
    document.querySelector('.filter-text').value = filterBy.txt;
}

function setFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search);
    const filterBy = {
        maxPrice: queryStringParams.get('maxPrice') || 200,
        minRate: queryStringParams.get('minRate') || 0,
        txt: queryStringParams.get('txt') || ''
    }
    return setGfilterBy(filterBy);
}

function getModalByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search);
    return queryStringParams.get('modalId');
}

function onPaging(param) {
    switchPage(param);
    renderBooks();
}

function renderModal(bookId) {
    if (bookId === null) return;
    updateUrl(getGfilterBy(), bookId);
    document.querySelector('.modal-container').innerHTML =
        `
    <div class="modal modal-left-transition">
        <div class="modal-header">
            <h5>${getBookValue(bookId, 'name')}</h5>
            <button onclick="removeModal()">X</button>
        </div>
        <div>
        <p>${getBookValue(bookId, 'bookContent')}</p>
        </div>
            <div class="rate-container">
                <h5>rate:</h5>
                <div class="rate-btn-container">
                    <button onclick="onChangeRate(${bookId},1)">+</button>
                    <span class="current-book-rate"></span>
                    <button onclick="onChangeRate(${bookId},-1)">-</button>
                </div>
            </div>
        </div>
    `
    renderModalBookRate(bookId);
}

function renderModalBookRate(bookId) {
    document.querySelector('.current-book-rate').innerText = `${getBookValue(bookId, 'rate')}`
}

function removeModal() {
    document.querySelector('.modal-container').innerHTML = '';
    updateUrl(getGfilterBy(), null);
}

function onReadBook(bookId) {
    renderModal(bookId);
    setGModalId(bookId);
}

function onChangeRate(bookId, num) {
    updateRate(bookId, num);
    renderModalBookRate(bookId);
    renderBooks();

}

function onUpdateBook(bookId) {
    disablePointerEvents('body');
    renderNewPricePrompt(bookId);
}

function onRemoveBook(bookId) {
    removeBook(bookId);
    if (getModalId() === -1) {
        updateUrl(getGfilterBy(), -1);
        removeModal();
    }
    renderBooks();
    renderPageBtns();

}

function onAddBook() {
    disablePointerEvents('body');
    renderCustomNewBookPrompt();
}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy);
    updateUrl(filterBy, getModalId())
    renderBooks();
}

function updateUrl(filterBy, modalId) {
    const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}&txt=${filterBy.txt}${modalId ? `&modalId=${modalId}` : ''}`;
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onChangeLayout(layoutType) {
    updateLayout(layoutType);
    renderBooks();
    renderLayoutBtns(layoutType)
}

function renderLayoutBtns(layoutType) {
    const isTable = layoutType === 'table' ? 'grid' : 'table';
    document.querySelector(`.${layoutType}-btn img`).src = `./img/${layoutType}-white.png`
    document.querySelector(`.${isTable}-btn img`).src = `./img/${isTable}-orange.png`
    document.querySelector(`.${layoutType}-btn`).classList.add('active-layout-btn')
    document.querySelector(`.${isTable}-btn`).classList.remove('active-layout-btn')
}

function renderNewPricePrompt(bookId) {
    const container = document.createElement('div');
    container.classList.add('prompted-input-container');
    document.querySelector('body').appendChild(container);
    document.querySelector('.prompted-input-container').innerHTML =
        `
        <div class="prompted-input-container">
            <div class="txt-start enter-price-container">
                <label>New Price:</label>
                <input type="text" value="" oninput="this.title=this.value" class="prompted-input"></input>
           
            </div>
            <div>
                <button onclick="onConfirmNewPrice(${bookId})">confirm</button>
                <button onclick="removeCustomPropmpt()">deny</button>
            </div>
        </div>
    `
    enablePointerEvents('.prompted-input-container');

}

function onConfirmNewPrice(bookId) {
    enablePointerEvents('body');
    const value = document.querySelector('.prompted-input').value;
    const error1 = document.querySelector('.error-msg1');
    if (error1) error1.innerHTML = ''
    if (isNaN(value) || value === '') {
        addChildElement('p', 'error-msg1', '.enter-price-container', 'enter valid price')
        return
    }
    updateBook(bookId, +document.querySelector('.prompted-input').value, 'price');
    removeCustomPropmpt();
    renderBooks();
}

function renderCustomNewBookPrompt() {
    const htmlStr =
        `
            <div class="txt-start enter-name-container">
                <label>Book Name:</label>
                <input type="text" value="" oninput="this.title=this.value" placeholder="enter book name" class="prompted-name-input"></input>
            </div>
            <div class="txt-start enter-price-container">
                <label>Book Price:</label>
                <input type="text" value="" oninput="this.title=this.value" placeholder="enter book price"class="prompted-price-input"></input>
            </div> 
            <div>
                <button onclick="onConfirmNewBook()">add</button>
                <button onclick="removeCustomPropmpt()">cancel</button>
            </div>           
        `
    addChildElement('div', 'prompted-input-container', 'body', htmlStr);
    enablePointerEvents('.prompted-input-container');
}

function onConfirmNewBook() {
    enablePointerEvents('body');
    let name = document.querySelector('.prompted-name-input').value;
    const error1 = document.querySelector('.error-msg1');
    const error2 = document.querySelector('.error-msg2');
    if (error1) error1.innerHTML = ''
    if (error2) error2.innerHTML = ''

    let isValidInput = true;
    if (!name) {
        isValidInput = false
        addChildElement('p', 'error-msg1', '.enter-name-container', 'enter valid name')
    }
    let price = document.querySelector('.prompted-price-input').value;
    if (+price > getMAX_PRICE() || +price < 0 || /\D|^$/g.test(price)) {
        isValidInput = false
        addChildElement('p', 'error-msg2', '.enter-price-container', 'enter valid price')
    }
    if (!isValidInput) return;
    addBook(name, price);
    removeCustomPropmpt();
    renderBooks();
}

function removeCustomPropmpt() {
    enablePointerEvents('body')
    document.querySelector('.prompted-input-container').remove();
}

function onSort(obj) {
    setBooksSort(obj);
    renderBooks()
}

function disablePointerEvents(el) {
    document.querySelector(el).classList.add('unclickable')
}

function enablePointerEvents(el) {
    document.querySelector(el).classList.remove('unclickable')
    document.querySelector(el).classList.add('clickable')
}

function addChildElement(elChild, childClass, parentQuery, htmlStr) {
    const container = document.createElement(`${elChild}`);
    container.classList.add(`${childClass}`);
    document.querySelector(`${parentQuery}`).appendChild(container);
    document.querySelector(`.${childClass}`).innerHTML = htmlStr
}

function switchPage(param) {
    const pageIdx = setGpageIdx(param)
    if (gPageIdx === 0) {
        document.querySelector(".prev-page").disabled = true;
    } else {
        document.querySelector(".prev-page").disabled = false;
    }
    if ((gPageIdx + 1) * PAGE_SIZE >= gBooks.length) {
        document.querySelector(".next-page").disabled = true;
    } else {
        document.querySelector(".next-page").disabled = false;
    }

    document.querySelectorAll('.page-btn').forEach(btn => btn.disabled = false);
    document.querySelector(`.page-${gPageIdx}`).disabled = true;
}

function toggleMenu() {
    if (!gMenuVisible) document.querySelector('.side-bars-container').classList.toggle('side-bars-container-mobile')
    else document.querySelector('.side-bars-container').classList.toggle('side-bars-container-mobile')
    gMenuVisible = !gMenuVisible;
}
