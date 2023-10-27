import useFetchCategories from "./hooks/useFetchCategories";
import useFetchEvents from "./hooks/useFetchEvents";
import Header from "./components/header/Header";
import {
  CategoryTile,
  CategoryProps,
} from "./components/categoryTile/CategoryTile";
import "./App.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function App() {
  const { categories, categoryLoading, categoryError } = useFetchCategories(
    "http://localhost:1337/api/categories"
  );

  const { events, eventLoading, eventError } = useFetchEvents(
    "http://localhost:1337/api/events?populate=category"
  );

  const calendarEvents = events?.map((event) => {
    return {
      title: event.title,
      start: event.start,
      end: event.end,
      backgroundColor: event.category.color,
    };
  });

  console.log(calendarEvents);

  return (
    <>
      <div className="h-screen flex flex-row font-sans">
        <div className="basis-1/6 bg-gray-100 border-r border-b border-gray-200">
          <Header title="Calendar" />
          <div className="w-full p-3">
            <h2 className="text-xl font-bold">Categories</h2>
            <ul className="mt-2 grid grid-cols-2 gap-1 text-center">
              {categories &&
                categories.map((category: CategoryProps) => (
                  <li key={category.id}>
                    <CategoryTile {...category} />
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className="basis-5/6 font-sans py-5 px-10 h-full">
          {(categoryLoading || eventLoading) && (
            <div className="loading">Loading...</div>
          )}
          {(categoryError || eventError) && (
            <div className="error">Error...</div>
          )}
          {(categories || events) && (
            <>
              <FullCalendar
                initialView="dayGridMonth"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "today",
                  center: "prev title next",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={calendarEvents}
                allDaySlot={false}
                slotLabelFormat={{
                  hour12: false,
                  hour: "numeric",
                  minute: "2-digit",
                  omitZeroMinute: false,
                  meridiem: false,
                }}
                nowIndicator={true}
                locale={"en-gb"}
                fixedWeekCount={false}
                firstDay={1}
                editable={true}
                eventResizeStop={(info) => {
                  console.log(info.event.end);
                }}
                eventDrop={(info) => {
                  console.log(info.event.end);
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
