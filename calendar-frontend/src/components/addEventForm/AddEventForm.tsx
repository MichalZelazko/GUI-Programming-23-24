import { Dispatch, SetStateAction } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { CategoryProps } from "../categoryTile/CategoryTile";
import "./AddEventForm.css";
import { CalendarEventProps } from "../../App";

type AddEventFormProps = {
  categories: CategoryProps[] | null;
  events: CalendarEventProps[] | null;
  setEvents: Dispatch<SetStateAction<CalendarEventProps[] | null>>;
  setIsOpen?: Dispatch<SetStateAction<boolean>> | null;
};

const AddEventForm = (props: AddEventFormProps) => {
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
    if (data.start > data.end)
      return toast.error("Start date cannot be after end date!");
    let newId;
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
      })
        .then((response) => response.json())
        .then((data) => (newId = data.id.toString()));
      toast.success("Event added!", {
        position: "bottom-center",
      });
      props.setIsOpen && props.setIsOpen(false);
      reset();
      props.setEvents([
        ...(props.events ?? []),
        {
          id:
            newId ??
            (props.events ? (props.events.length + 1).toString() : "1"),
          title: data.title,
          start: data.start,
          end: data.end,
          backgroundColor:
            props.categories?.find(
              (category) => category.id.toString() === data.category
            )?.color ?? "#000",
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
              placeholder="Event title"
              {...register("title", { required: true })}
            />
            {errors?.title && <span>This field is required</span>}
            <label htmlFor="start">Start date</label>
            <input
              type="datetime-local"
              id="start"
              placeholder="Event start date"
              {...register("start", { required: true })}
            />
            {errors?.start && <span>This field is required</span>}
            <label htmlFor="end">End date</label>
            <input
              type="datetime-local"
              id="end"
              placeholder="Event end date"
              {...register("end", { required: true })}
            />
            {errors?.end && <span>This field is required</span>}
            <label htmlFor="category">Category</label>
            <select id="category" {...register("category", { required: true })}>
              {props.categories &&
                props.categories.map((category: CategoryProps) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
            {errors?.category && <span>This field is required</span>}
            <input
              className="w-full p-5 text-xl font-semibold uppercase bg-[#5c0000] text-white border border-black rounded-lg hover:bg-black mt-5 transition-all duration-300"
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
