'use strict'

var gCurrLang = 'en';
const gTrans = {
    'shop-title': {
        'en': 'My Book Shop',
        'he': 'חנות הספרים שלי'
    },
    'book-name': {
        'en': 'Book Name',
        'he': 'שם הספר'
    },
    'read': {
        'en': 'Read',
        'he': 'קרא'
    },
    'update-price': {
        'en': 'Update',
        'he': 'עדכן'
    },
    'delete-book': {
        'en': 'Delete',
        'he': 'מחק'
    },
    'max-price': {
        'en': 'Max Price',
        'he': 'מחיר מקסימלי'
    },
    'min-rate': {
        'en': 'Min Rate',
        'he': 'דירוג מינימלי'
    },
    'find-book': {
        'en': 'Find',
        'he': 'מצא ספר'
    },
    'sort-by': {
        'en': 'Sort By',
        'he': 'מיין לפי'
    },
    'title': {
        'en': 'Title',
        'he': 'שם'
    },
    'price': {
        'en': 'Price',
        'he': 'מחיר'
    },
    'create-book': {
        'en': 'Create New Book',
        'he': 'צור ספר חדש'
    },
    'actions': {
        'en': 'Actions',
        'he': 'פעולות'
    },
    'id': {
        'en': 'Id',
        'he': 'מספר'
    },
    'language': {
        'en': 'Language',
        'he': 'שפה'
    },
    'hebrew': {
        'en': 'Hebrew',
        'he': 'עברית'
    },
    'english': {
        'en': 'English',
        'he': 'אנגלית'
    },
    'sort-by': {
        'en': 'Sort By',
        'he': 'מיון לפי'
    },
    'new-price': {
        'en': 'New Price',
        'he': 'מחיר חדש'
    },
    'confirm': {
        'en': 'confirm',
        'he': 'אשר'
    },
    'deny': {
        'en': 'deny',
        'he': 'ביטול'
    },
    'rate': {
        'en': 'Rate',
        'he': 'דירוג'
    },
    'book-name-hebrew': {
        'en': 'Book Name Hebrew',
        'he': 'שם הספר בעברית'
    },
    'price-of-book': {
        'en': 'Book Price',
        'he': 'מחיר'
    },
    'add': {
        'en': 'add',
        'he': 'הוסף'
    },
    'cancel': {
        'en': 'cancel',
        'he': 'בטל'
    },
    'valid-name': {
        'en': 'Enter Valid Name',
        'he': 'הקלד שם חוקי'
    },
    'valid-price': {
        'en': 'Enter Valid Price',
        'he': 'הקלד מחיר חוקי'
    },
    'enter-price-placeholder': {
        'en': 'Enter Price',
        'he': 'הקלד מחיר'
    },
    'enter-name-placeholder': {
        'en': 'Enter Book Name ',
        'he': 'הקלד את שם הספר'
    },
    'enter-hebrew-name-placeholder': {
        'en': 'Enter Hebrew Name',
        'he': 'הקלד את השם בעברית'
    },
    'no-result': {
        'en': 'No Result',
        'he': 'אין תוצאות'
    },
}


function doTrans(lang,parent = 'html') {
    // if(lang = gCurrLang) return;
    gCurrLang = lang;
    const els = document.querySelectorAll(`${parent} [data-trans]`);
    els.forEach(el => {
        if(el.placeholder) el.placeholder = getTrans(el.dataset.trans)
        el.innerText = getTrans(el.dataset.trans)
    });
}

function getTrans(transKey) {
    const transMap = gTrans[transKey];
    if (!transMap) return 'unknown';
    const trans = transMap[gCurrLang];
    if (!trans) return transMap.en;
    return trans;
}

function getCurrLang(){
    return gCurrLang;
}

function setCurrLang(lang){
    gCurrLang = lang;
}