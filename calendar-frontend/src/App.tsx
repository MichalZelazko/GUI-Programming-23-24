import useFetchCategories from "./hooks/useFetchCategories";
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
      {/* <h1>Calendar GUI</h1> */}
      <div className="main-container">
        <div className="calendar-container">
          {loading && <div>Loading...</div>}
          {error && <div>Error...</div>}
          {data && (
            // data.map(({ id, attributes }) => (
            //   <CategoryTile
            //     key={id}
            //     id={id}
            //     attributes={attributes as CategoryTileAttributes}
            //   />
            // ))}
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
          )}
        </div>
      </div>
    </>
  );
}

export default App;
