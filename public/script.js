document.getElementById('theater-select').addEventListener('change', fetchGenres);
document.getElementById('genre-select').addEventListener('change', fetchMovies);
document.getElementById('seat-count').addEventListener('input', updateBookingDetails);
document.getElementById('submit-button').addEventListener('click', bookTickets);

let selectedMovie = '';
let selectedShowtime = '';
let selectedTheater = '';

async function fetchGenres() {
    const theaterId = document.getElementById('theater-select').value;

    if (theaterId) {
        document.getElementById('genre-select').disabled = false;
    } else {
        document.getElementById('genre-select').disabled = true;
        clearSelections();
    }
}

async function fetchMovies() {
    const theaterId = document.getElementById('theater-select').value;
    const genre = document.getElementById('genre-select').value;

    if (theaterId && genre) {
        const response = await fetch(`http://localhost:3000/api/movies?theaterId=${theaterId}&genre=${genre}`);
        const movies = await response.json();

        const moviesContainer = document.getElementById('movies-container');
        moviesContainer.innerHTML = '';

        if (movies.length > 0) {
            movies.forEach(movie => {
                const movieDiv = document.createElement('div');
                movieDiv.innerHTML = `
                    <p>${movie.title} - ${movie.genre} - Price: $${movie.price}</p>
                    <button onclick="selectShowtime(${movie.id}, ${movie.price}, '${movie.title}')">Select Showtime</button>
                `;
                moviesContainer.appendChild(movieDiv);
            });
        } else {
            moviesContainer.innerHTML = '<p>No movies available for this selection.</p>';
        }

        document.getElementById('seat-count').disabled = false;
    } else {
        alert('Please select both a theater and a genre.');
    }
}

async function selectShowtime(movieId, moviePrice, movieTitle) {
    selectedMovie = movieTitle;
    selectedTheater = document.getElementById('theater-select').options[document.getElementById('theater-select').selectedIndex].text;
    
    const theaterId = document.getElementById('theater-select').value;
    const response = await fetch(`http://localhost:3000/api/showtimes?theaterId=${theaterId}&movieId=${movieId}`);
    const showtimes = await response.json();

    const showtimeContainer = document.getElementById('showtime-container');
    showtimeContainer.innerHTML = '';

    if (showtimes.length > 0) {
        showtimes.forEach(showtime => {
            const showtimeDiv = document.createElement('div');
            showtimeDiv.innerHTML = `
                <p>${new Date(showtime.showtime).toLocaleString()}</p>
                <button onclick="setTicketDetails(${moviePrice}, '${showtime.showtime}')">Select</button>
            `;
            showtimeContainer.appendChild(showtimeDiv);
        });
    } else {
        showtimeContainer.innerHTML = `
            <p>No showtimes available. Would you like to:</p>
            <button onclick="fetchMovies()">Try a different movie</button>
            <button onclick="fetchGenres()">Try a different genre</button>
        `;
    }
}

function setTicketDetails(moviePrice, showtime) {
    const numberOfSeats = document.getElementById('seat-count').value;
    const totalPrice = numberOfSeats * moviePrice;
    
    const ticketDetailsContainer = document.getElementById('ticket-details');
    ticketDetailsContainer.innerHTML = `
        <p>Showtime: ${new Date(showtime).toLocaleString()}</p>
        <p>Number of Seats: ${numberOfSeats}</p>
        <p>Total Price: $${totalPrice.toFixed(2)}</p>
    `;

    selectedShowtime = showtime;

    // Enable the Book Ticket button
    document.getElementById('submit-button').disabled = false;
}

function updateBookingDetails() {
    const moviePrice = document.querySelector('#movies-container button:enabled');
    const selectedMoviePrice = moviePrice ? parseFloat(moviePrice.getAttribute('data-price')) : 0;
    const numberOfSeats = document.getElementById('seat-count').value;

    if (selectedMoviePrice && numberOfSeats) {
        const totalPrice = numberOfSeats * selectedMoviePrice;
        document.getElementById('ticket-details').innerHTML = `
            <p>Total Price: $${totalPrice.toFixed(2)}</p>
        `;
        document.getElementById('submit-button').disabled = false; // Enable button
    }
}

function clearSelections() {
    document.getElementById('genre-select').disabled = true;
    document.getElementById('genre-select').value = '';
    document.getElementById('movies-container').innerHTML = '';
    document.getElementById('showtime-container').innerHTML = '';
    document.getElementById('seat-count').value = 1;
    document.getElementById('seat-count').disabled = true;
    document.getElementById('ticket-details').innerHTML = '';
    document.getElementById('submit-button').disabled = true;
}

function bookTickets() {
    const numberOfSeats = document.getElementById('seat-count').value;
    const message = `
        ${numberOfSeats} ticket(s) booked successfully!
        Theater: ${selectedTheater}
        Movie: ${selectedMovie}
        Showtime: ${new Date(selectedShowtime).toLocaleString()}
        Payment done successfully.
    `;

    alert(message); // Display confirmation message
    clearSelections(); // Clear all selections after booking
}




document.addEventListener('DOMContentLoaded', () => {
    const userRole = localStorage.getItem('userRole');
    
    if (userRole === 'administrator') {
        // Fetch and display bookings for the administrator
        fetchBookings(); // Define this function as needed
    } else if (userRole === 'customer') {
        // Load the existing functionalities
        // Initialize your existing code for customers
    } else {
        window.location.href = 'login.html'; // Redirect to login if no role
    }
});

// Example function to fetch bookings for the administrator
async function fetchBookings() {
    const response = await fetch('http://localhost:3001/api/bookings'); // You need to implement this API
    const bookings = await response.json();
    
    // Code to display bookings on the page
    // You may need to create a separate container for bookings
}
