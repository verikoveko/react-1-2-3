import { useEffect, useState } from "react";
import { roomsData } from "../data/rooms.js";

// Custom Hook: room data loading state is managed in one place.
export default function useFetchRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setRooms(roomsData);
      setError("");
    } catch {
      setError("ნომრების ჩატვირთვა ვერ მოხერხდა.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { rooms, loading, error };
}