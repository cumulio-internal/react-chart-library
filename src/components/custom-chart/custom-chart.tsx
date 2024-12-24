import React, { useEffect, useState } from "react";
import { fetchLuzmoData } from "./fetch-data";
import "./custom-chart.css";

interface BookingData {
  roomNumber: number;
  month: string;
  monthIndex: number;
  bookings: number;
}

export function CustomChart() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [uniqueRooms, setUniqueRooms] = useState<number[]>([]);
  const [uniqueMonths, setUniqueMonths] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchLuzmoData();
        const formattedData = response.data.map((item: any[]) => {
          const date = new Date(item[1]);
          return {
            roomNumber: item[0],
            month: date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            }),
            monthIndex: date.getMonth(),
            bookings: item[2],
          };
        });

        const rooms = [
          ...new Set(formattedData.map((item) => item.roomNumber)),
        ].sort((a, b) => a - b);
        const months = [...new Array(12)].map((_, i) =>
          new Date(2024, i).toLocaleDateString("en-US", { month: "long" })
        );

        setBookings(formattedData);
        setUniqueRooms(rooms);
        setUniqueMonths(months);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    loadData();
  }, []);

  const getBookingForCell = (room: number, monthName: string) => {
    return (
      bookings.find((b) => b.roomNumber === room && b.month.includes(monthName))
        ?.bookings || 0
    );
  };

  const getBubbleSize = (bookings: number) => {
    const baseSize = 20;
    const maxSize = 50;
    return Math.min(baseSize + bookings * 10, maxSize);
  };

  return (
    <div className="custom-chart">
      <div className="chart-title">Hotel room occupancy</div>

      <div className="month-header-container">
        <div></div>
        {uniqueMonths.map((month) => (
          <div key={month} className="month-label">
            {month}
          </div>
        ))}
      </div>

      <div className="grid-container hide-scrollbar">
        <div className="grid">
          {uniqueRooms.map((room) => (
            <React.Fragment key={`row-${room}`}>
              <div className="room-number">{room}</div>
              {uniqueMonths.map((month) => {
                const bookingCount = getBookingForCell(room, month);
                const bubbleSize = getBubbleSize(bookingCount);
                return (
                  <div key={`${room}-${month}`} className="cell">
                    {bookingCount > 0 && (
                      <div
                        className="bed-container"
                        style={{
                          width: `${bubbleSize}px`,
                          height: `${bubbleSize * 0.6}px`,
                        }}
                      >
                        <div className="bed-mattress" />
                        <div className="bed-headboard" />
                        <div className="bed-footboard" />
                        <div className="booking-number">{bookingCount}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
