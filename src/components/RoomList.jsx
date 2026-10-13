import PropTypes from "prop-types";
import RoomCard from "./RoomCard.jsx";

export default function RoomList({ rooms, onBook, bookings }) {
  if (rooms.length === 0) {
    return <p className="empty-state">მითითებული კრიტერიუმებით ნომრები ვერ მოიძებნა.</p>;
  }

  return (
    <div className="rooms-grid">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          onBook={onBook}
          isBooked={bookings.some((booking) => booking.roomId === room.id)}
        />
      ))}
    </div>
  );
}

RoomList.propTypes = {
  rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
  onBook: PropTypes.func.isRequired,
  bookings: PropTypes.arrayOf(PropTypes.object).isRequired
};