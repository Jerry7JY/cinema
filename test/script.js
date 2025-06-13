// === Передача фильма на страницу movie.html ===
function goToMovie(movieName, imageFilename) {
    localStorage.setItem("selectedMovie", movieName);
    localStorage.setItem("selectedMovieImage", imageFilename);
    window.location.href = "movie.html";
}

// === Показ информации о фильме ===
window.onload = function () {
    if (window.location.pathname.endsWith("movie.html")) {
        const movie = localStorage.getItem("selectedMovie") || "Неизвестный фильм";
        document.getElementById("movie-title").textContent = movie;

        // Получаем имя файла картинки
        const imageFilename = localStorage.getItem("selectedMovieImage");
        const posterElement = document.getElementById("movie-poster");

        if (imageFilename) {
            posterElement.src = "images/" + imageFilename;
            posterElement.alt = movie;
        } else {
            posterElement.src = ""; // или заглушка
            posterElement.alt = "Картинка не найдена";
        }

        const descriptions = {
            "Мстители": "Герои Marvel объединяются в последней битве против Таноса.",
            "Титаник": "Любовная история на фоне реальной трагедии корабля «Титаник».",
            "Интерстеллар": "Путешествие сквозь червоточины и изучение других галактик."
        };

        document.getElementById("movie-description").textContent =
            descriptions[movie] || "Информация отсутствует.";
    }
};

// === Бронирование мест ===
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.endsWith("booking.html")) {
        const seatMap = document.getElementById("seat-map");
        const countSpan = document.getElementById("count");
        const totalSpan = document.getElementById("total");
        const pricePerTicket = 300;
        let selectedSeats = [];

        for (let i = 0; i < 60; i++) {
            const seat = document.createElement("div");
            seat.classList.add("seat");
            if (i % 7 === 0) seat.classList.add("taken");

            seat.addEventListener("click", function () {
                if (seat.classList.contains("taken")) return;
                seat.classList.toggle("selected");

                const index = selectedSeats.indexOf(i);
                if (index === -1) selectedSeats.push(i);
                else selectedSeats.splice(index, 1);

                updateSummary();
            });

            seatMap.appendChild(seat);
        }

        function updateSummary() {
            countSpan.textContent = selectedSeats.length;
            totalSpan.textContent = selectedSeats.length * pricePerTicket;
        }

        window.checkout = function () {
            if (selectedSeats.length === 0) {
                alert("Выберите хотя бы одно место!");
                return;
            }

            let tickets = JSON.parse(localStorage.getItem("userTickets")) || [];
            const newTicket = {
                film: localStorage.getItem("selectedMovie") || "Неизвестный фильм",
                seats: selectedSeats,
                time: new Date().toLocaleString()
            };
            tickets.push(newTicket);
            localStorage.setItem("userTickets", JSON.stringify(tickets));

            alert("Билеты успешно забронированы!");
            window.location.href = "my-tickets.html";
        };
    }
});

// === Отображение билетов ===
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.endsWith("my-tickets.html")) {
        const list = document.getElementById("tickets-list");
        const tickets = JSON.parse(localStorage.getItem("userTickets")) || [];

        if (tickets.length === 0) {
            list.innerHTML = "<li>У вас пока нет билетов.</li>";
        } else {
            tickets.forEach(ticket => {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${ticket.film}</strong><br>Места: ${ticket.seats.join(", ")}<br>Время: ${ticket.time}`;
                list.appendChild(li);
            });
        }
    }
});