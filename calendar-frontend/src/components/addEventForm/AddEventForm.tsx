import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { CategoryProps } from "../categoryTile/CategoryTile";

const AddEventForm = (categories: CategoryProps[] | null) => {
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
    } catch (error) {
      toast.error("Event add failed!", {
        position: "bottom-center",
      });
    }
  };

  return (
    <>
      <div className="w-full p-3">
        <h2 className="text-xl font-bold mt-7">Add an event</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-2 flex flex-col gap-2">
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
              className="w-full p-5 text-xl font-bold uppercase bg-gray-800 text-white border border-black rounded-lg hover:bg-gray-700 mt-2"
              type="submit"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default AddEventForm;
