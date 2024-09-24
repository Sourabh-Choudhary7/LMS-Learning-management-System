import { useNavigate } from "react-router-dom";

function CourseCard({ data }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/course/description", { state: { ...data } })}
      className="bg-zinc-800 text-white w-[22rem] h-auto shadow-lg rounded-lg cursor-pointer group overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105"
    >
      <div className="overflow-hidden">
        <img
          className="h-48 w-full rounded-t-lg object-cover group-hover:scale-110 transition-all duration-300"
          src={data?.thumbnail?.secure_url}
          alt="course thumbnail"
        />
      </div>
      <div className="p-5 space-y-2">
        <h2 className="text-2xl font-bold text-yellow-500 line-clamp-2">
          {data?.title}
        </h2>
        <p className="text-gray-300 line-clamp-2">{data?.description}</p>
        <p className="font-semibold">
          <span className="text-yellow-500 font-bold">Category: </span>
          {data?.category}
        </p>
        <p className="font-semibold">
          <span className="text-yellow-500 font-bold">Total lectures: </span>
          {data?.numberOfLectures}
        </p>
        <p className="font-semibold">
          <span className="text-yellow-500 font-bold">Instructor: </span>
          {data?.createdBy}
        </p>
      </div>
    </div>
  );
}

export default CourseCard;
