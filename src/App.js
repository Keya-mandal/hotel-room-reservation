import React, { useState } from "react";
import "./App.css";

const generateHotel = () => {
  const hotel = [];
  for (let f = 1; f <= 10; f++) {
    const roomCount = f === 10 ? 7 : 10;
    const rooms = [];
    for (let i = 1; i <= roomCount; i++) {
      rooms.push({
        number: f * 100 + i,
        floor: f,
        position: i,
        status: "available"
      });
    }
    hotel.push({ floor: f, rooms });
  }
  return hotel;
};

function App() {
  const [hotel, setHotel] = useState(generateHotel());
  const [count, setCount] = useState("");

  const reset = () => setHotel(generateHotel());

  const randomOccupancy = () => {
    const updated = hotel.map(floor => ({
      ...floor,
      rooms: floor.rooms.map(room => ({
        ...room,
        status: Math.random() > 0.7 ? "occupied" : "available"
      }))
    }));
    setHotel(updated);
  };

  const bookRooms = () => {
    const n = parseInt(count);
    if (!n || n < 1 || n > 5) {
      alert("Enter 1 to 5 rooms");
      return;
    }

    let best = null;
    let bestCost = Infinity;

    // Same floor priority
    hotel.forEach(floor => {
      const free = floor.rooms.filter(r => r.status === "available");
      for (let i = 0; i <= free.length - n; i++) {
        const slice = free.slice(i, i + n);
        const cost = slice[slice.length - 1].position - slice[0].position;
        if (cost < bestCost) {
          bestCost = cost;
          best = slice;
        }
      }
    });

    // Cross floor booking
    if (!best) {
      const allFree = hotel.flatMap(f =>
        f.rooms.filter(r => r.status === "available")
      );

      for (let i = 0; i <= allFree.length - n; i++) {
        const slice = allFree.slice(i, i + n);
        const floors = slice.map(r => r.floor);
        const positions = slice.map(r => r.position);
        const cost =
          (Math.max(...floors) - Math.min(...floors)) * 2 +
          (Math.max(...positions) - Math.min(...positions));
        if (cost < bestCost) {
          bestCost = cost;
          best = slice;
        }
      }
    }

    if (!best) {
      alert("Not enough rooms available");
      return;
    }

    const updated = hotel.map(floor => ({
      ...floor,
      rooms: floor.rooms.map(room =>
        best.some(b => b.number === room.number)
          ? { ...room, status: "booked" }
          : room
      )
    }));

    setHotel(updated);
  };

  return (
    <div className="container">
      <h2>Hotel Room Reservation System</h2>

      <div className="controls">
        <input
          placeholder="No of Rooms"
          value={count}
          onChange={e => setCount(e.target.value)}
        />
        <button onClick={bookRooms}>Book</button>
        <button onClick={reset}>Reset</button>
        <button onClick={randomOccupancy}>Random</button>
      </div>

      <div className="hotel">
        {hotel.map(floor => (
          <div key={floor.floor} className="floor">
            <div className="lift">Lift</div>
            {floor.rooms.map(room => (
              <div key={room.number} className={`room ${room.status}`}>
                {room.number}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
