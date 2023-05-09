function updateTimer() {

  var countDownDate = new Date("May 9, 2023 23:00:59").getTime();

 
  var now = new Date().getTime();

  var timeRemaining = countDownDate - now;

  var days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  var hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  document.getElementById("timer").innerHTML = "Next Show start in: "  + hours + "h "
  + minutes + "m " + seconds + "s ";

  if (timeRemaining < 0) {
      clearInterval(timerInterval);
      document.getElementById("timer").innerHTML = "Time's up!";
  }
}

var timerInterval = setInterval(updateTimer, 1000);


const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat');
const count = document.getElementById('count');
const price = document.getElementById('price');

const movieSelect = document.getElementById('movie');
let ticketPrice = +movieSelect.value;

const populateUI = () => {
  const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));

  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add('selected');
      }
    });
  }

  const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');
  const selectedMoviePrice = localStorage.getItem('selectedMoviePrice');

  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
  }

  if (selectedMoviePrice !== null) {
    count.innerText = selectedSeats.length;
    price.innerText = selectedSeats.length * +selectedMoviePrice;
  }
};

populateUI();

selectedMovie = (movieIndex, moviePrice) => {
  localStorage.setItem('selectedMovieIndex', movieIndex);
  localStorage.setItem('selectedMoviePrice', moviePrice);
};

const updateSelectedSeatsCount = () => {
  const selectedSeats = document.querySelectorAll('.row .selected');

  const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));

  localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

  const selectedSeatsCount = selectedSeats.length;

  count.innerText = selectedSeatsCount;
  price.innerText = selectedSeatsCount * ticketPrice;
};


container.addEventListener('click', e => {
  if (
    e.target.classList.contains('seat') &&
    !e.target.classList.contains('occupied')
  ) {
    e.target.classList.toggle('selected');

    updateSelectedSeatsCount();
  }
});


movieSelect.addEventListener('change', e => {
  ticketPrice = +e.target.value;
  selectedMovie(e.target.selectedIndex, e.target.value);

  updateSelectedSeatsCount();
});



let currentMovieSlug = '';

const setMovieSlug = () => {
  currentMovieSlug = '';
  let movie = movieSelect.options[movieSelect.selectedIndex].text;
  movie = movie.slice(0, movie.lastIndexOf('₹') - 1);
  movie = movie.trim();
  movie.replace(' ', '-');
  currentMovieSlug = movie;
}

const populateOccupiedSeats = () => {
  const occupiedSeats = JSON.parse(localStorage.getItem(currentMovieSlug + 'Occupied'));

  seats.forEach(seat => seat.classList.remove('occupied'));

  if (occupiedSeats != null && occupiedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (occupiedSeats.indexOf(index) > -1) {
        seat.classList.remove('selected');
        seat.classList.add('occupied');
      }
    });
  }
}

const purchaseSeats = () => {
  const selectedSeats = container.querySelectorAll('.seat.selected');
  selectedSeats.forEach(seat => {
    seat.classList.remove('selected');
    seat.classList.add('occupied');
  });
  const seatIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));
  localStorage.setItem(currentMovieSlug + 'Occupied', JSON.stringify(seatIndex));
  
}

const reset = () => {
  localStorage.removeItem(currentMovieSlug + 'Occupied');
  populateOccupiedSeats();
}

const purchaseBtn = document.querySelector('#purchase');
if (purchaseBtn != null) {
  purchaseBtn.addEventListener('click', purchaseSeats);
}

const resetBtn = document.querySelector('#reset');
if (resetBtn != null) {
  resetBtn.addEventListener('click', reset);
}

movieSelect.addEventListener('change', () => {
  setMovieSlug();
  populateOccupiedSeats();
});

setMovieSlug();

populateOccupiedSeats();
