'use strict'

var gMenuVisible = false;

function onInit() {
    renderFilterByQueryStringParams();
    renderLang(getCurrLang());
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
    if (books.length === 0) document.querySelector('.books-container').innerHTML = `<h1 class="no-res-h1" data-trans="no-result">No Result</h1>`;
    doTrans(getCurrLang());
}

function renderTable(books) {
    const tableStr =
        `<div class="table-container">
        <table>
            <thead>
                <tr>
                    <th data-trans="id">Id</th>
                    <th data-trans="title" onclick="onSort({name:true})" class="sort-table-th" >Title</th>
                    <th data-trans="price" onclick="onSort({price:true})" class="sort-table-th" >Price</th>
                    <th data-trans="rate">Rate</th>            
                    <th data-trans="actions">Actions</th>            
                </tr>
            </thead>
            <tbody class="table-tbody"></tbody>
        </table>
    </div>`

    var tableBooksStr = '';
    books.map(book => {
        tableBooksStr += `<tr>`;
        for (const prop in book) {
            if (prop === 'bookContent' || prop === 'imgUrl') continue;     
            let value = prop === 'name' || prop === 'bookContent' ? book[prop][getCurrLang()] : book[prop];
            if(prop === 'rate'){
                value = getStartsStr(book[prop])
            }       
            tableBooksStr += `<td class="${prop}-table-td">${value}</td>`
        }
        tableBooksStr += getBtnsStr(book.id);
        tableBooksStr += '</tr>';
    });
    tableBooksStr = tableBooksStr.slice(0, tableBooksStr.length - 10)
    document.querySelector('.books-container').innerHTML = tableStr;
    document.querySelector('.table-tbody').innerHTML = tableBooksStr;
    // doTrans(getCurrLang(),'.table-container')
}

function renderBooksGrid(books) {
    const leftSideBarStr =
        `
   
    
        <div>
            <p class="sort-by-p" data-trans="sort-by" style="display:inline-block">Sort By </p>:
        </div>
        <button onclick="onSort({name:true})" data-trans="title">Title</button>
        <button onclick="onSort({price:true})" data-trans="price">Price</button>
    `
    const gridBooksStr =
        `
    <div class="books-grid-container"> 
    ${books.map(book =>
            `<div class="book">
                <img src="${book.imgUrl}" onerror="this.src = 'img/book${book.id % 7}.jpg'"></img>
                <div class="book-content-container">
                    <h5>${book.name[getCurrLang()]}</h5>
                    <h5 class="ltr">${localePrice(book.price)}</h5>
                </div>
                <div class="grid-btns-container">
                    ${getBtnsStr(book.id)}
                </div>
                <div class="stars">${getStartsStr(book.rate)}</div>
            </div>
   `
        ).join('')}
    </div>
    `
    document.querySelector('.books-container').innerHTML = gridBooksStr;
    document.querySelector('.sort-btns-container').innerHTML = leftSideBarStr;
}

function getStartsStr(num){
    let str = ''
    while(num){
        str+= '★'
        num--;
    }
    while(str.length < getMinRate()){
        str+= '☆'
    }
    return str;
}

function getBtnsStr(bookId) {
    return `<td><button onclick="onReadBook(${bookId})" data-trans="read">Read</button></td>
            <td><button onclick="onUpdateBook(${bookId})" data-trans="update-price">Update</button></td>
            <td><button onclick="onRemoveBook(${bookId})" data-trans="delete-book">Delete</button></td>`
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
    const queryLangStr = queryStringParams.get('lang');
    setCurrLang(queryLangStr ? queryLangStr : 'en');
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
    updateUrl(getGfilterBy(), bookId, getCurrLang());
    document.querySelector('.modal-container').innerHTML =
        `
    <div class="modal modal-left-transition">
        <div class="modal-header">
            <h5>${getBookValue(bookId, 'name')[getCurrLang()]}</h5>
            <button onclick="removeModal()">X</button>
        </div>
        <div>
        <p>${getBookValue(bookId, 'bookContent')[getCurrLang()]}</p>
        </div>
            <div class="rate-container">
                <h5 data-trans="rate">${getTrans('rate')}</h5>:
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
    updateUrl(getGfilterBy(), null, getCurrLang());
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
        updateUrl(getGfilterBy(), -1, getCurrLang());
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
    updateUrl(filterBy, getModalId(), getCurrLang())
    renderBooks();
}

function updateUrl(filterBy, modalId, currLang) {
    const queryStringParams = `?lang=${currLang}&maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}&txt=${filterBy.txt}${modalId ? `&modalId=${modalId}` : ''}`;
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
       
            <div class="txt-start enter-price-container">
                <label><span data-trans="new-price"></span>:</label>
                <input type="text" value="" oninput="this.title=this.value" class="prompted-input"></input>
            </div>
            <div>
                <button onclick="onConfirmNewPrice(${bookId})" data-trans="confirm"></button>
                <button onclick="removeCustomPropmpt()" data-trans="deny"></button>
            </div>
      
    `
    enablePointerEvents('.prompted-input-container');
    doTrans(getCurrLang(),'.prompted-input-container')
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
                <label data-trans="book-name">Book Name</label>:
                <input type="text" value="" oninput="this.title=this.value" placeholder="enter book name" 
                data-trans="enter-name-placeholder" class="prompted-name-input"></input>
            </div>
            <div class="txt-start enter-hebrew-name-container">
                <label data-trans="book-name-hebrew">Book Name Hebrews</label>:
                <input type="text" value="" oninput="this.title=this.value" placeholder="enter hebrew book name" 
                data-trans="enter-hebrew-name-placeholder" class="prompted-hebrew-name-input"></input>
            </div>
            <div class="txt-start enter-price-container">
                <label data-trans="price-of-book">Book Price</label>:
                <input type="text" value="" oninput="this.title=this.value" placeholder="enter book price" 
                data-trans="enter-price-placeholder" class="prompted-price-input"></input>
            </div> 
            <div>
                <button onclick="onConfirmNewBook()" data-trans="add">add</button>
                <button onclick="removeCustomPropmpt()" data-trans="cancel">cancel</button>
            </div>           
        `
    addChildElement('div', 'prompted-input-container', 'body', htmlStr);
    enablePointerEvents('.prompted-input-container');
    doTrans(getCurrLang(), '.prompted-input-container')
}

function onConfirmNewBook() {
    enablePointerEvents('body');
    let name = document.querySelector('.prompted-name-input').value;
    let hebName = document.querySelector('.prompted-hebrew-name-input').value;
    const error1 = document.querySelector('.error-msg1');
    const error2 = document.querySelector('.error-msg2');
    const error3 = document.querySelector('.error-msg3');
    if (error1) error1.innerHTML = ''
    if (error2) error2.innerHTML = ''
    if (error3) error3.innerHTML = ''

    let isValidInput = true;
    if (!name) {
        isValidInput = false
        addChildElement('p', 'error-msg1', '.enter-name-container', getTrans('valid-name'))
    }
    if (!hebName) {
        isValidInput = false
        addChildElement('p', 'error-msg3', '.enter-hebrew-name-container', getTrans('valid-name'))
    }
    let price = document.querySelector('.prompted-price-input').value;
    if (+price > getMAX_PRICE() || +price < 0 || /\D|^$/g.test(price)) {
        isValidInput = false
        addChildElement('p', 'error-msg2', '.enter-price-container', getTrans('valid-price'))
    }
    if (!isValidInput) return;
    addBook({ en: name, he: hebName }, price);
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

// i18n

function onLangChange(lang) {
    updateUrl(getGfilterBy(), getModalId(), lang);
    renderLang(lang);
    renderModal(getModalId());
}

// CR: how should i do that?
function renderLang(lang) {
    if (lang === 'he') document.querySelector('body').classList.add('rtl');
    else document.querySelector('body').classList.remove('rtl');
    updateOptions(lang);
    doTrans(lang);
    renderBooks();
}

function updateOptions(lang) {
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        if (option.value === lang) {
            option.disabled = true;
            return option.selected = true;
        }
        option.disabled = false;
        return option.selected = false;
    });
}

function localePrice(price) {
    if (getCurrLang() === 'he') return formatCurrencyISR(price);
    else return formatCurrencyUSD(price)
}