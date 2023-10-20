import useFetchCategories from "./hooks/useFetchCategories";
import Header from "./components/header/Header";
// import {
//   CategoryTile,
//   CategoryTileAttributes,
// } from "./components/categoryTile/CategoryTile";
import "./App.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function App() {
  const { data, loading, error } = useFetchCategories(
    "http://localhost:1337/api/categories"
  );

  return (
    <>
      <Header title="Calendar" />
      <div className="container mx-auto">
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">Error...</div>}
        {data && (
          <>
            <FullCalendar
              initialView="dayGridMonth"
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "today",
                center: "prev title next",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              allDaySlot={false}
              slotLabelFormat={{
                hour12: false,
                hour: "numeric",
                minute: "2-digit",
                omitZeroMinute: false,
                meridiem: false,
              }}
              fixedWeekCount={false}
              firstDay={1}
            />
          </>
        )}
      </div>
    </>
  );
}

export default App;
