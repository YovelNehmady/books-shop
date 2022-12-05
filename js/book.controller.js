'use strict'

function onInit() {
    renderFilterByQueryStringParams()
    renderBooks()
}

function renderBooks() {
    const books = getBooks()
    var strHTML = `<tr>
    <th>Id</th>
    <th>Book name</th>
    <th>Rate</th>
    <th>Price</th>
    <th colspan="3">Actions</th>

    </tr>`
    strHTML += books.map(book => `<tr>
    <td> ${book.id} </td>  
    <td> ${book.name} </td>  
    <td> ${book.rate} </td>  
    <td> ${book.price}$ </td>  
    <td><button class="actions-btn" onclick="onReadBook('${book.id}')">Read</button></td>  
    <td><button class="actions-btn" onclick="onUpdateBook('${book.id}')">Update</button></td>  
    <td><button class="actions-btn" onclick="onDeleteBook('${book.id}')">Delete</button></td>  
    </tr>`).join('')
    document.querySelector('.books-tabel').innerHTML = strHTML
}

function onSearchBox(ev) {
    ev.preventDefault()
    var elFilter = document.querySelector('input[name="search-box"]')
    var filter = elFilter.value
    const filterBy = { search: filter }
    setBookFilter(filterBy)
    renderBooks()
}

function onNextPage(){
    nextPage()
    renderBooks()
}

function onPrevPage(){
    prevPage()
    renderBooks()
}

function onReadBook(bookId) {
    const book = getBookById(bookId)
    var elModal = document.querySelector('.modal')
    renderRateBook(bookId, book)
    elModal.querySelector('h4').innerText = book.name
    elModal.querySelector('.img').innerHTML = `<img src="/img/${book.img}"/>`
    elModal.classList.add('open')

}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    renderBooks()
}

function setFilterByQueryStringParams(filterBy) {

    const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}&search=${filterBy.search}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        maxPrice: +queryStringParams.get('maxPrice') || 150,
        minRate: +queryStringParams.get('minRate') || 0,
        search: queryStringParams.get('search') || ''
    }

    if (!filterBy.maxPrice && !filterBy.minRate && !filterBy.search) return

    document.querySelector('.filter-rate-range').value = filterBy.minRate
    document.querySelector('.filter-price-range').value = filterBy.maxPrice
    document.querySelector('.search').value = filterBy.search
    setBookFilter(filterBy)
}

function renderRateBook(bookId, book) {
    document.querySelector('.rate').innerHTML = `<button onclick="onChangeRateBook('${bookId}',-1)">-</button>
<span>${book.rate}</span>
<button onclick="onChangeRateBook('${bookId}',1)">+</button>`
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
}

function onDeleteBook(bookId) {
    deleteBook(bookId)
    renderBooks()
}

function onUpdateBook(bookId) {
    const price = +prompt('enter the new price')
    if (!price) return
    updateBook(bookId, price)
    renderBooks()
}

function onAddBook() {
    const name = prompt('enter the book name')
    const price = +prompt('enter the book price')
    addBook(name ,price)
    renderBooks()
}

function onChangeRateBook(bookId, val) {
    const book = getBookById(bookId)
    if (book.rate === 10 && val === 1) return
    else if (!book.rate && val === -1) return
    changeRateBook(bookId, val)
    renderRateBook(bookId, book)
    renderBooks()
}










