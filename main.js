document.addEventListener('DOMContentLoaded', function () {
    const inputBookForm = document.getElementById('inputBook');
    const searchBookForm = document.getElementById('searchBook');
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    inputBookForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    searchBookForm.addEventListener('submit', function (event) {
        event.preventDefault();
        searchBook();
    });

    function addBook() {
        const inputBookTitle = document.getElementById('inputBookTitle').value;
        const inputBookAuthor = document.getElementById('inputBookAuthor').value;
        const inputBookYear = document.getElementById('inputBookYear').value;
        const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;

        const book = {
            id: +new Date(),
            title: inputBookTitle,
            author: inputBookAuthor,
            year: parseInt(inputBookYear),
            isComplete: inputBookIsComplete,
        };

        const bookItem = createBookItem(book);

        // Update tampilan sesuai dengan rak yang benar
        if (book.isComplete) {
            completeBookshelfList.appendChild(bookItem);
        } else {
            incompleteBookshelfList.appendChild(bookItem);
        }

        // Memasukkan buku ke dalam rak sesuai propertinya
        const bookshelfList = book.isComplete ? completeBookshelfList : incompleteBookshelfList;
        bookshelfList.appendChild(bookItem);

        updateDataToStorage();
        clearForm();
    }

    function createBookItem(book) {
        const bookItem = document.createElement('article');
        bookItem.classList.add('book_item');
        bookItem.dataset.id = book.id;

        const bookTitle = document.createElement('h3');
        bookTitle.innerText = book.title;

        const bookAuthor = document.createElement('p');
        bookAuthor.innerText = `Penulis: ${book.author}`;

        const bookYear = document.createElement('p');
        bookYear.innerText = `Tahun: ${book.year}`;

        const bookAction = document.createElement('div');
        bookAction.classList.add('action');

        const buttonAction = document.createElement('button');
        buttonAction.classList.add(book.isComplete ? 'green' : 'red');
        buttonAction.innerText = book.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca';
        buttonAction.addEventListener('click', function () {
            moveBook(book);
        });

        const buttonDelete = document.createElement('button');
        buttonDelete.classList.add('red');
        buttonDelete.innerText = 'Hapus buku';
        buttonDelete.addEventListener('click', function () {
            deleteBook(bookItem, book);
        });

        bookAction.appendChild(buttonAction);
        bookAction.appendChild(buttonDelete);

        bookItem.appendChild(bookTitle);
        bookItem.appendChild(bookAuthor);
        bookItem.appendChild(bookYear);
        bookItem.appendChild(bookAction);

        return bookItem;
    }

    function moveBook(book) {
        const sourceShelf = book.isComplete ? completeBookshelfList : incompleteBookshelfList;
        const destinationShelf = book.isComplete ? incompleteBookshelfList : completeBookshelfList;

        const bookItem = createBookItem(book);

        // Update tampilan sesuai dengan rak yang benar
        if (book.isComplete) {
            incompleteBookshelfList.appendChild(bookItem);
        } else {
            completeBookshelfList.appendChild(bookItem);
        }

        sourceShelf.removeChild(document.querySelector(`.book_item[data-id="${book.id}"]`));

        updateDataToStorage();
    }

    function deleteBook(bookItem, book) {
        if (bookItem === null) {
            const confirmation = confirm(`Apakah Anda yakin ingin menghapus buku '${book.title}'?`);
            if (!confirmation) {
                return;
            }
        } else {
            bookItem.remove();
        }

        updateDataToStorage();
    }

    function searchBook() {
        const searchBookTitle = document.getElementById('searchBookTitle').value.toLowerCase();
        const allBooks = [...incompleteBookshelfList.children, ...completeBookshelfList.children];

        allBooks.forEach((bookItem) => {
            const bookTitle = bookItem.querySelector('h3').innerText.toLowerCase();
            const isBookMatch = bookTitle.includes(searchBookTitle);

            if (!isBookMatch) {
                bookItem.style.display = 'none';
            } else {
                bookItem.style.display = 'block';
            }
        });
    }

    function updateDataToStorage() {
        const allBooks = [...incompleteBookshelfList.children, ...completeBookshelfList.children];
        const books = [];

        allBooks.forEach((bookItem) => {
            const book = {
                id: +bookItem.dataset.id,
                title: bookItem.querySelector('h3').innerText,
                author: bookItem.querySelector('p:nth-child(2)').innerText.replace('Penulis: ', ''),
                year: parseInt(bookItem.querySelector('p:nth-child(3)').innerText.replace('Tahun: ', '')),
                isComplete: bookItem.classList.contains('complete'),
            };

            books.push(book);
        });

        localStorage.setItem('books', JSON.stringify(books));
    }

    function clearForm() {
        document.getElementById('inputBookTitle').value = '';
        document.getElementById('inputBookAuthor').value = '';
        document.getElementById('inputBookYear').value = '';
        document.getElementById('inputBookIsComplete').checked = false;
    }

    function loadDataFromStorage() {
        const storedBooks = localStorage.getItem('books');
        if (storedBooks !== null) {
            const books = JSON.parse(storedBooks);

            books.forEach((book) => {
                const bookItem = createBookItem(book);

                // Update tampilan sesuai dengan rak yang benar
                if (book.isComplete) {
                    completeBookshelfList.appendChild(bookItem);
                } else {
                    incompleteBookshelfList.appendChild(bookItem);
                }

                // Memasukkan buku ke dalam rak sesuai propertinya
                const bookshelfList = book.isComplete ? completeBookshelfList : incompleteBookshelfList;
                bookshelfList.appendChild(bookItem);
            });
        }
    }

    // Load data from storage when the page is loaded
    loadDataFromStorage();
});
