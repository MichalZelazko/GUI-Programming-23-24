import { useEffect, useState } from "react";
import useFetchCategories from "./hooks/useFetchCategories";
import useFetchEvents from "./hooks/useFetchEvents";
import updateEvent, { EventUpdateProps } from "./hooks/updateEvent";
import Header from "./components/header/Header";
import {
  CategoryTile,
  CategoryProps,
} from "./components/categoryTile/CategoryTile";
import pickTextColorBasedOnBgColorAdvanced from "./commons/PickTextColorBasedOnBgColorAdvanced";
import "./App.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {
  EventResizeDoneArg,
} from "@fullcalendar/interaction";
import toast, { Toaster } from "react-hot-toast";
import AddEventForm from "./components/addEventForm/AddEventForm";
import { EventClickArg, EventDropArg } from "@fullcalendar/core/index.js";
import ReactModal from "react-modal";
import { SubmitHandler, useForm } from "react-hook-form";
import deleteEvent from "./hooks/deleteEvent";

export type CalendarEventProps = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor: string;
};

function App() {
  const { categories, categoryLoading, categoryError } = useFetchCategories(
    "http://localhost:1337/api/categories"
  );

  const { events, eventLoading, eventError } = useFetchEvents(
    "http://localhost:1337/api/events?populate=category"
  );

  const [calendarEvents, setCalendarEvents] = useState<
    CalendarEventProps[] | null
  >([] as CalendarEventProps[]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EditFormValues | null>(
    null
  );

  useEffect(() => {
    if (events) {
      const updatedEvents = events.map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        backgroundColor: event.category.color,
        textColor: pickTextColorBasedOnBgColorAdvanced(
          event.category.color,
          "#fff",
          "#000"
        ),
        borderColor: "#777",
      }));
      setCalendarEvents(updatedEvents);
    }
  }, [events]);

  const updateCalendarEvent = async (
    info: EventResizeDoneArg | EventDropArg
  ) => {
    try {
      updateEvent(`http://localhost:1337/api/events/${info.event.id}`, {
        id: info.event.id,
        start: info.event.start,
        end: info.event.end,
      } as EventUpdateProps);

      toast.success("Event updated!", {
        position: "bottom-center",
      });
    } catch (error) {
      toast.error("Event update failed!", {
        position: "bottom-center",
      });
    }
  };

  type EditFormValues = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    action?: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EditFormValues>();

  const onSubmit: SubmitHandler<EditFormValues> = (data) => {
    console.log(data);
    if (data.action === "Update" && data.start > data.end)
      return toast.error("Start date cannot be after end date!");
    try {
      if (data.action === "Update") {
        updateEvent(`http://localhost:1337/api/events/${data.id}`, {
          id: data.id,
          title: data.title,
          start: data.start,
          end: data.end,
        } as EventUpdateProps);
        const updatedEvents = calendarEvents?.map((event) =>
          event.id == data.id
            ? { ...event, title: data.title, start: data.start, end: data.end }
            : event
        );
        if (updatedEvents) setCalendarEvents(updatedEvents);
        toast.success("Event updated!", {
          position: "bottom-center",
        });
      } else if (data.action === "Delete") {
        deleteEvent(`http://localhost:1337/api/events/${data.id}`);
        const updatedEvents = calendarEvents?.filter(
          (event) => event.id != data.id
        );
        if (updatedEvents) setCalendarEvents(updatedEvents);
        toast.success("Event deleted successfully!", {
          position: "bottom-center",
        });
      }
      setIsEditOpen(false);
      reset();
    } catch (error) {
      toast.error("Event update failed!", {
        position: "bottom-center",
      });
    }
  };

  const handleClickedEvent = (info: EventClickArg) => {
    const clickedEvent = calendarEvents?.find(
      (event) => event.id == info.event.id
    );
    if (clickedEvent) {
      const correctStart = new Date(clickedEvent.start);
      correctStart.setTime(correctStart.getTime() + 60 * 60 * 1000); // Add 1 hour in milliseconds
      const correctEnd = new Date(clickedEvent.end);
      correctEnd.setTime(correctEnd.getTime() + 60 * 60 * 1000); // Add 1 hour in milliseconds
      setSelectedEvent({
        id: clickedEvent.id,
        title: clickedEvent.title,
        start: correctStart,
        end: correctEnd,
      });
      toggleEditModal(); // Open the edit modal when an event is clicked
      setValue("title", clickedEvent.title);
      setValue(
        "start",
        correctStart.toISOString().slice(0, 16) as unknown as Date
      );
      setValue("end", correctEnd.toISOString().slice(0, 16) as unknown as Date);
      setValue("id", clickedEvent.id);
    }
  };

  const toggleEditModal = () => {
    setIsEditOpen(!isEditOpen);
  };

  const toggleAddModal = () => {
    setIsAddOpen(!isAddOpen);
  };

  if (categoryLoading || eventLoading) {
    return (
      <>
        <div className="w-screen h-screen text-3xl flex items-center justify-center">
          Loading...
        </div>
      </>
    );
  } else if (categoryError || eventError) {
    return (
      <>
        <div className="w-screen h-screen text-3xl flex items-center justify-center">
          Error...
        </div>
      </>
    );
  } else {
    return (
      <>
        <div>
          <Toaster />
        </div>
        <div className="h-screen flex flex-col md:flex-row font-sans">
          <div className="relative">
            <Header title="GUI Calendar" header />
            <button
              onClick={toggleAddModal}
              className="md:hidden absolute text-white top-1 right-4 text-3xl font-semibold"
            >
              +
            </button>
            <ReactModal
              isOpen={isAddOpen}
              onRequestClose={toggleAddModal}
              className="w-[90%] h-auto flex flex-col justify-center items-center bg-white border border-gray-200 rounded-md absolute z-[3]"
              overlayClassName="fixed flex items-center justify-center top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[2]"
              preventScroll={true}
              appElement={document.getElementById("root") as HTMLElement}
            >
              <button
                onClick={toggleAddModal}
                className="md:hidden absolute top-1 right-2 text-2xl z[4]"
              >
                ×
              </button>
              <AddEventForm
                categories={categories}
                events={calendarEvents}
                setEvents={setCalendarEvents}
                setIsOpen={setIsAddOpen}
              />
              <div className="w-full p-3">
                <h2 className="text-xl font-bold">Categories</h2>
                <ul className="mt-2 grid grid-cols-3 gap-2 text-center">
                  {categories &&
                    categories.map((category: CategoryProps) => (
                      <li key={category.id}>
                        <CategoryTile {...category} />
                      </li>
                    ))}
                </ul>
              </div>
            </ReactModal>
          </div>
          <div className="hidden md:flex flex-col basis-1/6 bg-[#ffdddd52] border-r border-b border-gray-300 shadow-lg">
            <Header title="GUI Calendar" />
            <AddEventForm
              categories={categories}
              events={calendarEvents}
              setEvents={setCalendarEvents}
            />
            <div className="w-full p-3">
              <h2 className="text-xl font-bold">Categories</h2>
              <ul className="mt-2 flex flex-col gap-1 text-center">
                {categories &&
                  categories.map((category: CategoryProps) => (
                    <li key={category.id}>
                      <CategoryTile {...category} />
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="md:basis-5/6 font-sans py-2 md:py-5 px-3 md:px-10 h-full w-full">
            {(categories || events) && (
              <>
                <ReactModal
                  isOpen={isEditOpen}
                  onRequestClose={toggleEditModal}
                  className="w-auto h-auto flex flex-col justify-center items-center bg-white border border-gray-200 rounded-md absolute z-[3]"
                  overlayClassName="fixed flex items-center justify-center top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[2]"
                  appElement={document.getElementById("root") as HTMLElement}
                >
                  <div className="w-auto p-5 h-auto flex flex-col justify-center items-center bg-white border border-gray-200 rounded-md absolute z-[3]">
                    <button
                      onClick={toggleEditModal}
                      className="absolute top-1 right-2 text-2xl z[4]"
                    >
                      ×
                    </button>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="flex flex-col">
                        <input
                          type="hidden"
                          {...register("id")}
                          value={selectedEvent?.id}
                          id="edit-id"
                        />
                        <label htmlFor="edit-title">Title</label>
                        <input
                          type="text"
                          id="edit-title"
                          {...register("title", { required: true })}
                        />
                        {errors?.title && <span>This field is required</span>}
                        <label htmlFor="edit-start">Start date</label>
                        <input
                          type="datetime-local"
                          id="edit-start"
                          {...register("start", { required: true })}
                        />
                        {errors?.start && <span>This field is required</span>}
                        <label htmlFor="edit-end">End date</label>
                        <input
                          type="datetime-local"
                          id="edit-end"
                          {...register("end", { required: true })}
                        />
                        {errors?.end && <span>This field is required</span>}
                        <button
                          type="submit"
                          className="mt-3 bg-gray-800 px-4 py-3 text-white font-semibold text-center rounded-md border border-black uppercase"
                          onClick={() => setValue("action", "Update")}
                        >
                          Update
                        </button>
                        <button
                          type="submit"
                          className="mt-2 bg-red-600 px-4 py-3 text-white font-semibold text-center rounded-md border border-black uppercase"
                          onClick={() => setValue("action", "Delete")}
                        >
                          Delete
                        </button>
                      </div>
                    </form>
                  </div>
                </ReactModal>
                <FullCalendar
                  initialView="timeGridWeek"
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  headerToolbar={{
                    left: "today",
                    center: "prev title next",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                  }}
                  events={calendarEvents ? calendarEvents : []}
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
                  locale={"en-GB"}
                  fixedWeekCount={false}
                  firstDay={1}
                  editable={true}
                  eventClick={(info: EventClickArg) => {
                    handleClickedEvent(info);
                  }}
                  eventResize={(info) => {
                    updateCalendarEvent(info);
                  }}
                  eventDrop={(info) => {
                    updateCalendarEvent(info);
                  }}
                  eventOverlap={true}
                  height={"100%"}
                  expandRows={true}
                />
              </>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default App;
