import PropTypes from "prop-types";

export default function RoomCard({ room, onBook, isBooked }) {
  const canBook = room.available && !isBooked;

  return (
    <article className="room-card">
      <img className="room-image" src={room.image} alt={room.name} />
      <div className="room-content">
        <div className="room-topline">
          <span className="room-type">{room.type}</span>
          <span className={room.available ? "status available" : "status unavailable"}>
            {room.available ? "თავისუფალია" : "დაკავებულია"}
          </span>
        </div>
        <h3>{room.name}</h3>
        <p className="description">{room.description}</p>
        <p className="capacity">👤 მაქსიმუმ {room.capacity} სტუმარი</p>
        <p className="price">{room.price} ₾ <small>/ ღამე</small></p>
        <button disabled={!canBook} onClick={() => onBook(room)}>
          {!room.available ? "დაკავებულია" : isBooked ? "უკვე დაჯავშნილია" : "დაჯავშნა"}
        </button>
      </div>
    </article>
  );
}

RoomCard.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    capacity: PropTypes.number.isRequired,
    available: PropTypes.bool.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired,
  onBook: PropTypes.func.isRequired,
  isBooked: PropTypes.bool.isRequired
};