const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Data-Engineering2', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define a schema for reservations
const reservationSchema = new mongoose.Schema({
    borrower_id: String,
    fullname_borrower: String,
    book_id: String,
    book_title: String,
    author_name: String,
    date_borrowed: Date,
    due_date_returned: Date
});

const Reservation = mongoose.model('Reservation', reservationSchema);

// POST route to save reservation data
app.post('/User/submit-reservation', async (req, res) => {
    try {
        const { borrower_id, fullname_borrower, book_id, book_title, author_name, date_borrowed, due_date_returned } = req.body;
        
        if (!borrower_id || !fullname_borrower || !book_id || !book_title || !author_name || !date_borrowed || !due_date_returned) {
            return res.status(400).send('Missing required fields');
        }

        const newReservation = new Reservation({
            borrower_id,
            fullname_borrower,
            book_id,
            book_title,
            author_name,
            date_borrowed,
            due_date_returned
        });

        await newReservation.save();
        res.status(200).send('Reservation saved successfully!');
    } catch (error) {
        console.error('Error saving reservation:', error);
        res.status(500).send('Error saving reservation');
    }
});


// GET route to retrieve reservation data
app.get('/get-reservations', async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).send('Error retrieving reservations');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Example route to get book details by book_id
app.get('/get-book', (req, res) => {
    const bookId = req.query.book_id;
    // Fetch the book data from your database using bookId
    const book = getBookById(bookId); // Replace with actual data fetching logic
    res.json(book);
});

// Example route to update book details
app.post('/update-book', (req, res) => {
    const { book_id, book_title, author_name, stock_count } = req.body;
    // Update the book details in your database
    const updatedBook = updateBook(book_id, book_title, author_name, stock_count); // Replace with actual update logic
    res.json(updatedBook);
});
