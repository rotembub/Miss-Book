import { bookService } from '../services/books.services.js';
import bookList from '../cmps/book-list.cmp.js';
import bookFilter from '../cmps/book-filter.cmp.js'
// import {eventBus} from '../services/event-bus-service.js'

export default {
    template: `
        <section class="book-app">
            <book-filter @filter="setFilter"></book-filter>
            <book-list v-if="books" :books="booksToShow"></book-list>
        </section>
    `,
    components: {
        bookList,
        bookFilter,
    },
    data() {
        return {
            books: null,
            filterBy: null,
        }
    },
    created() {
        bookService.query()
            .then(books => this.books = books)
    },
    methods: {
        setFilter(filter) {
            this.filterBy = filter;
        }
    },
    computed: {
        booksToShow() {
            if (!this.filterBy) return this.books;
            const nameFilter = this.filterBy.byName.toLowerCase();
            const booksToShow = this.books.filter(book => {
                return (book.title.toLowerCase().includes(nameFilter) && book.listPrice.amount <= this.filterBy.toPrice && book.listPrice.amount >= this.filterBy.fromPrice);

            });
            return booksToShow;
        }
    }

}