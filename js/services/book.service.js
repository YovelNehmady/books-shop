'use strict'

const STORAGE_KEY = `booksDB`
const PAGE_SIZE = 5

var gPageIdx = 0
var gBooks
var gFilterBy = { minRate: 0, maxPrice: 150, search: '' }


_creatBooks()


function nextPage() {
    if ((gPageIdx + 1) * PAGE_SIZE < gBooks.length) {
        gPageIdx++
    } else return
}

function prevPage() {
    gPageIdx--
    if (gPageIdx === -1) gPageIdx = 0
}

function getBooks() {
    var books
    if (gFilterBy.search) {
        books = gBooks.filter(book => book.price <= gFilterBy.maxPrice &&
            book.rate >= gFilterBy.minRate && book.name.toUpperCase().indexOf(gFilterBy.search.toUpperCase()) > -1)
    } else {
        books = gBooks.filter(book => book.price <= gFilterBy.maxPrice &&
            book.rate >= gFilterBy.minRate && book.name.indexOf(gFilterBy.search) > -1)
    }


    var startIdx = gPageIdx * PAGE_SIZE
    return books.slice(startIdx, startIdx + PAGE_SIZE)
}

function getBookById(bookId) {
    return gBooks.find(book => book.id === bookId)
}

function changeRateBook(bookId, val) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    gBooks[bookIdx].rate += val
    _saveBooksToStorage()
}

function setBookFilter(filterBy = {}) {
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    if (filterBy.search !== undefined) gFilterBy.search = filterBy.search
    setFilterByQueryStringParams(gFilterBy)
    return gFilterBy
}

function deleteBook(bookId) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function updateBook(bookId, price) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    gBooks[bookIdx].price = price
    _saveBooksToStorage()
}

function addBook(name, price) {
    gBooks.unshift(_creatBook(name, undefined , price))
    _saveBooksToStorage()
}

function _creatBook(name, img = `icon.png`, price = getRandomIntInclusive(0, 150)) {
    return {
        id: makeId(),
        name,
        price,
        img,
        desc: makeLorem(),
        rate: 0
    }
}

function _creatBooks() {
    var books = loadFromStorage(STORAGE_KEY)

    if (!books || !books.length) {
        const booksNames = [`The Kite Runner`, `Lost horizon`, `The Godfather`, `The bell jar`, `God's Mountain`]
        books = booksNames.map(name => _creatBook(name, `${name}.jpg`))
    }
    gBooks = books
    _saveBooksToStorage()
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}


