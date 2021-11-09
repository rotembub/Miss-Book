import { bookService } from '../services/books.services.js';
import { eventBus } from '../services/event-bus-service.js';

export default {
    template: `
        <section class="book-add-page">
            <h1>Web Search</h1>
            <p>Look for books you wish to add to our collection</p>
            <input v-model.lazy="txt" type="text"  placeholder="Search on the web">
            <!-- <span>{{txt}}</span> -->
            <button @click="searchFor">Search</button>
            <div v-if="books" class="search-results">
                <ul v-for="book in books">
                    <li>Title: {{book.volumeInfo.title}}</li>
                    <li>By: {{arrayForDisplay(book.volumeInfo.authors)}}</li>
                    <button @click="addBook(book.id)">Add</button>
                </ul>
            </div>

        </section>
    `,
    data() {
        return {
            txt: null,
            books: null,

        }
    },
    created() {
        console.log('add created');
    },
    mounted() {

    },
    methods: {
        searchFor() {
            bookService.getSearchResults(this.txt)
                .then(books => {
                    console.log(books);
                    this.books = books;
                })
                .catch(err => console.log('Error, ', err));
        },
        addBook(id) {
            var book = this.books.find(book => book.id === id);

            var newBook = {
                id: book.id,
                title: book.volumeInfo.title,
                subtitle: book.volumeInfo.subtitle,
                authors: book.volumeInfo.authors,
                publishedDate: book.volumeInfo.publishedDate,
                description: book.volumeInfo.description,
                pageCount: book.volumeInfo.pageCount,
                categories: book.volumeInfo.categories,
                thumbnail: book.volumeInfo.imageLinks.thumbnail,
                language: book.volumeInfo.language,
                listPrice: {
                    amount: 150,
                    currencyCode: "ILS",
                    isOnSale: false,
                }
            }
            bookService.addGoogleBook(newBook)
                .then(() => {
                    eventBus.$emit('added') ///////////////////////
                })
                .catch(err => {
                    console.log('Error', err);
                })
            // console.log('added', newBook);
            // NEED TO EMIT ADDED BOOK SO IT WILL BE UPDATED !
        }

    },
    computed: {
        arrayForDisplay(array) {
            return array.join(' | ');
        }
    },
};

