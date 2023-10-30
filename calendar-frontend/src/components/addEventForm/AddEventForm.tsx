import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { CategoryProps } from "../categoryTile/CategoryTile";
import "./AddEventForm.css";
import { CalendarEventProps } from "../../App";

const AddEventForm = ({
  categories,
  events,
  setEvents,
}: {
  categories: CategoryProps[] | null;
  events: CalendarEventProps[] | null;
  setEvents: React.Dispatch<React.SetStateAction<CalendarEventProps[] | null>>;
}) => {
  type FormValues = {
    title: string;
    start: Date;
    end: Date;
    category: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    try {
      fetch("http://localhost:1337/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          start: data.start,
          end: data.end,
          category: {
            connect: [data.category],
          },
        }),
      });
      toast.success("Event added!", {
        position: "bottom-center",
      });
      reset();
      const bgColor =
        categories?.find((category) => category.id.toString() === data.category)
          ?.color ?? "#000";
      console.log(bgColor);
      setEvents([
        ...(events ?? []),
        {
          id: events?.length
            ? String(Number(events[events.length - 1].id) + 1)
            : "1",
          title: data.title,
          start: data.start,
          end: data.end,
          backgroundColor: bgColor,
        },
      ]);
    } catch (error) {
      toast.error("Event add failed!", {
        position: "bottom-center",
      });
    }
  };

  return (
    <>
      <div className="w-full p-3">
        <h2 className="text-xl font-bold">Add an event</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              {...register("title", { required: true })}
            />
            {errors?.title && <span>This field is required</span>}
            <label htmlFor="start">Start date</label>
            <input
              type="datetime-local"
              id="start"
              {...register("start", { required: true })}
            />
            {errors?.start && <span>This field is required</span>}
            <label htmlFor="end">End date</label>
            <input
              type="datetime-local"
              id="end"
              {...register("end", { required: true })}
            />
            {errors?.end && <span>This field is required</span>}
            <label htmlFor="category">Category</label>
            <select id="category" {...register("category", { required: true })}>
              {categories &&
                categories.map((category: CategoryProps) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
            {errors?.category && <span>This field is required</span>}
            <input
              className="w-full p-5 text-xl font-semibold uppercase bg-[#333333] text-white border border-black rounded-lg hover:bg-[#555555] mt-5 transition-all"
              type="submit"
              value="Add new event"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default AddEventForm;
