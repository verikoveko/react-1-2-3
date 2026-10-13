import { useEffect, useMemo, useRef, useState } from "react";
import useFetchRooms from "./hooks/useFetchRooms.js";
import RoomList from "./components/RoomList.jsx";

const STORAGE_KEY = "hotel-booking-student1-bookings";

function readBookings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const { rooms, loading, error } = useFetchRooms();

  const [search, setSearch] = useState("");
  const [roomType, setRoomType] = useState("All");
  const [maxPrice, setMaxPrice] = useState(500);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [bookings, setBookings] = useState(readBookings);

  // useRef lets the button move keyboard focus to the search input.
  const searchInputRef = useRef(null);

  // Save booking changes in localStorage.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  // useMemo recalculates the visible list only when a filter changes.
  const filteredRooms = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return rooms.filter((room) => {
      const matchesName = room.name.toLowerCase().includes(normalizedSearch);
      const matchesType = roomType === "All" || room.type === roomType;
      const matchesPrice = room.price <= maxPrice;
      const matchesAvailability = !availableOnly || room.available;
      return matchesName && matchesType && matchesPrice && matchesAvailability;
    });
  }, [rooms, search, roomType, maxPrice, availableOnly]);

  function handleBook(room) {
    if (!room.available || bookings.some((booking) => booking.roomId === room.id)) {
      return;
    }

    setBookings((current) => [
      ...current,
      {
        id: `${room.id}-${Date.now()}`,
        roomId: room.id,
        roomName: room.name,
        price: room.price
      }
    ]);
  }

  function handleCancelBooking(bookingId) {
    setBookings((current) => current.filter((booking) => booking.id !== bookingId));
  }

  const total = bookings.reduce((sum, booking) => sum + booking.price, 0);

  if (loading) return <main className="message">ნომრები იტვირთება...</main>;
  if (error) return <main className="message error">{error}</main>;

  return (
    <main className="page">
      <header className="hero">
        <div className="hero-content">
          <p className="eyebrow">STAY • RELAX • EXPLORE</p>
          <h1>იპოვე შენი იდეალური ნომერი</h1>
          <p>შეარჩიე ნომერი, რომელიც შენს მოგზაურობას განსაკუთრებულს გახდის.</p>
        </div>
      </header>

      <div className="container">
        <section className="filters panel" aria-labelledby="filters-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark">ROOM FINDER</p>
              <h2 id="filters-title">ნომრის ძებნა</h2>
            </div>
            <button className="text-button" onClick={() => {
              setSearch("");
              setRoomType("All");
              setMaxPrice(500);
              setAvailableOnly(false);
            }}>
              ფილტრების გასუფთავება
            </button>
          </div>

          <div className="filter-grid">
            <label>
              <span>ნომრის დასახელება</span>
              <input
                ref={searchInputRef}
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="მაგ. Deluxe Room"
              />
            </label>

            <label>
              <span>ნომრის ტიპი</span>
              <select value={roomType} onChange={(event) => setRoomType(event.target.value)}>
                <option value="All">ყველა ტიპი</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
            </label>

            <label>
              <span>მაქსიმალური ფასი: <strong>{maxPrice} ₾</strong></span>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
              />
            </label>
          </div>

          <div className="filter-bottom">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(event) => setAvailableOnly(event.target.checked)}
              />
              მხოლოდ თავისუფალი ნომრები
            </label>
            <button className="outline-button" onClick={() => searchInputRef.current?.focus()}>
              ძებნის ველზე გადასვლა
            </button>
          </div>
        </section>

        <section className="catalog" aria-labelledby="catalog-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark">OUR ROOMS</p>
              <h2 id="catalog-title">სასტუმროს ნომრები</h2>
            </div>
            <span className="result-count">{filteredRooms.length} ნომერი</span>
          </div>
          <RoomList rooms={filteredRooms} onBook={handleBook} bookings={bookings} />
        </section>

        <section className="bookings panel" aria-labelledby="bookings-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark">YOUR SELECTION</p>
              <h2 id="bookings-title">ჩემი ჯავშნები</h2>
            </div>
            <span className="result-count">{bookings.length} ჯავშანი</span>
          </div>

          {bookings.length === 0 ? (
            <p className="empty-state">ჯერ ჯავშანი არ დაგიმატებია. აირჩიე თავისუფალი ნომერი.</p>
          ) : (
            <>
              <div className="booking-list">
                {bookings.map((booking) => (
                  <div className="booking-row" key={booking.id}>
                    <div>
                      <strong>{booking.roomName}</strong>
                      <p>{booking.price} ₾ / ღამე</p>
                    </div>
                    <button className="remove-button" onClick={() => handleCancelBooking(booking.id)}>
                      გაუქმება
                    </button>
                  </div>
                ))}
              </div>
              <div className="total-row">
                <span>ჯამი ერთი ღამისთვის</span>
                <strong>{total} ₾</strong>
              </div>
              <p className="note">სასწავლო დემო: ჯავშნები ინახება მხოლოდ ამ ბრაუზერის localStorage-ში.</p>
            </>
          )}
        </section>

        <footer className="footer">Hotel Booking App · Scenario 3 · Student 1</footer>
      </div>
    </main>
  );
}