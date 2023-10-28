import useFetchCategories from "./hooks/useFetchCategories";
import useFetchEvents from "./hooks/useFetchEvents";
import updateEvent, { EventUpdateProps } from "./hooks/updateEvent";
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
import toast, { Toaster } from "react-hot-toast";

function App() {
  const { categories, categoryLoading, categoryError } = useFetchCategories(
    "http://localhost:1337/api/categories"
  );

  const { events, eventLoading, eventError } = useFetchEvents(
    "http://localhost:1337/api/events?populate=category"
  );

  const calendarEvents = events?.map((event) => {
    return {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      backgroundColor: event.category.color,
    };
  });

  return (
    <>
      <div>
        <Toaster />
      </div>
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
            <h2 className="text-xl font-bold mt-7">Add an event</h2>
            <form>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                className="w-full p-1 border border-gray-200 rounded-md"
              />
              <label htmlFor="start">Start</label>
              <input
                type="datetime-local"
                name="start"
                id="start"
                className="w-full p-1 border border-gray-200 rounded-md"
              />
              <label htmlFor="end">End</label>
              <input
                type="datetime-local"
                name="end"
                id="end"
                className="w-full p-1 border border-gray-200 rounded-md"
              />
              <label htmlFor="category">Category</label>
              <select
                name="category"
                id="category"
                className="w-full p-1 border border-gray-200 rounded-md"
              >
                {categories &&
                  categories.map((category: CategoryProps) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
              <button
                type="submit"
                className="w-full p-3 mt-2 bg-gray-800 text-white rounded-md border border-black"
              >
                Add event
              </button>
            </form>
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
                slotDuration={"00:15:00"}
                nowIndicator={true}
                locale={"en-gb"}
                fixedWeekCount={false}
                firstDay={1}
                editable={true}
                eventResize={(info) => {
                  try {
                    updateEvent(
                      `http://localhost:1337/api/events/${info.event.id}`,
                      {
                        id: info.event.id,
                        end: info.event.end,
                      } as EventUpdateProps
                    );
                    toast.success("Event updated!", {
                      position: "bottom-center",
                    });
                  } catch (error) {
                    toast.error("Event update failed!", {
                      position: "bottom-center",
                    });
                  } // finally with update events
                }}
                eventDrop={(info) => {
                  // PUT to /api/events/:id
                  try {
                    updateEvent(
                      `http://localhost:1337/api/events/${info.event.id}`,
                      {
                        id: info.event.id,
                        start: info.event.start,
                        end: info.event.end,
                      } as EventUpdateProps
                    );
                    toast.success("Event updated!", {
                      position: "bottom-center",
                    });
                  } catch (error) {
                    toast.error("Event update failed!", {
                      position: "bottom-center",
                    });
                  }
                }}
                eventOverlap={true}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
