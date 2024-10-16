import React, { useEffect } from "react";
import Layout from "../../layout/Layout";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { FaUsers } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { FcSalesPerformance } from "react-icons/fc";
import { BsCollectionPlayFill, BsTrash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses, removeCourse } from "../../redux/Slices/CourseSlice";
import { getStatsData } from "../../redux/Slices/statsSlice";
import { getPaymentRecord } from "../../redux/Slices/PaymentSlice";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allUsersCount, activeUsersCount, inActiveUsersCount, subscribedUsersCount } = useSelector(
    (state) => state.stats
  );
  const { allPayments, activePayments, finalMonths, monthlySalesRecord } = useSelector(
    (state) => state?.payment
  );
  let activePaymentsWithUsers = { paymentDetails: [] }; // Initialize data as an array

  // Push data from activePayments into activePaymentsWithUsers
  if (activePayments && activePayments.length > 0) {
    activePayments.forEach((payment) => {
      activePaymentsWithUsers.paymentDetails.push({
        ...payment
      });
    });
  }

  const totalSubscriptionsCount = allPayments?.data?.length || 0; // Number of subscriptions
  // total Profit amount
  const totalRevenue = allPayments?.data?.reduce((total, payment) => {
    const amount = payment.plan?.amount || 0;
    return total + amount;
  }, 0) / 100;

  const userData = {
    labels: ["Registered User", "Active User", "Inactive User", "Enrolled User"],
    datasets: [
      {
        label: "User Details",
        data: [allUsersCount, activeUsersCount, inActiveUsersCount, subscribedUsersCount],
        backgroundColor: ["blue", "yellow", "red", "green"],
        borderColor: ["blue", "yellow", "red", "green"],
        borderWidth: 1,
      },
    ],
  };

  const salesData = {
    labels: [
      "January", "Febraury", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
    ],
    fontColor: "white",
    datasets: [
      {
        label: "Sales / Month",
        data: monthlySalesRecord.map(value => value || 0),
        backgroundColor: ["green"],
        borderColor: ["white"],
        borderWidth: 2,
      },
    ],
  };

  // getting the courses data from redux toolkit store
  const myCourses = useSelector((state) => state.course.courseData);

  // function to handle the course delete
  const handleCourseDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete the course?")) {
      const res = await dispatch(removeCourse(id));

      // fetching the new updated data for the course
      if (res?.payload?.success) {
        await dispatch(getAllCourses());
      }
    }
  };

  useEffect(() => {
    (async () => {
      await dispatch(getAllCourses());
      await dispatch(getStatsData());
      await dispatch(getPaymentRecord());
    })();
  }, []);

  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col flex-wrap gap-10 text-white">
        <h1 className="text-center text-3xl font-semibold text-yellow-500">
          Admin Dashboard
        </h1>

        {/* creating the records card and chart for sales and user details */}
        <div className="grid grid-cols-2 gap-5 m-auto mx-10 max-md:flex max-md:flex-col max-md:items-center max-md:gap-0 max-md:mx-0">
          {/* displaying the users chart and data */}
          <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
            {/* for displaying the pie chart */}
            <div className="w-80 h-80">
              <Doughnut data={userData} />
            </div>

            {/* card for user data */}
            <div className="grid grid-cols-2 gap-5">
              {/* card for registered users */}
              <div className="flex items-center justify-between py-5 px-5 gap-5 rounded-md shadow-md">
                <div className="flex flex-col items-center">
                  <p className="font-semibold">Registered Users</p>
                  <h3 className="text-4xl font-bold">{allUsersCount}</h3>
                </div>
                <FaUsers className="text-yellow-500 text-5xl" />
              </div>

              {/* card for enrolled users */}
              <div className="flex items-center justify-between py-5 px-5 gap-5 rounded-md shadow-md">
                <div className="flex flex-col items-center">
                  <p className="font-semibold">Subscribed Users</p>
                  <h3 className="text-4xl font-bold">{subscribedUsersCount}</h3>
                </div>
                <FaUsers className="text-green-500 text-5xl" />
              </div>
            </div>
            <div>
              <button className="btn btn-success btn-md btn-outline" onClick={() => { navigate('/admin/all-users') }}>Users List</button>
            </div>
          </div>


          {/* displaying the sales chart and data */}
          <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
            {/* for displaying the bar chart */}
            <div className="h-80 relative w-full">
              <Bar className="absolute bottom-0 h-80 w-full" data={salesData} />
            </div>

            {/* card for user data */}
            <div className="grid grid-cols-2 gap-5">
              {/* card for registered users */}
              <div className="flex items-center justify-between py-5 px-5 gap-5 rounded-md shadow-md">
                <div className="flex flex-col items-center">
                  <p className="font-semibold">Subscriptions Count</p>
                  <h3 className="text-4xl font-bold">{totalSubscriptionsCount}</h3>
                </div>
                <FcSalesPerformance className="text-yellow-500 text-5xl" />
              </div>

              {/* card for enrolled users */}
              <div className="flex items-center justify-between py-5 px-5 gap-5 rounded-md shadow-md">
                <div className="flex flex-col items-center">
                  <p className="font-semibold">Total Revenue</p>
                  <h3 className="text-4xl font-bold">
                    {isNaN(totalRevenue) ? "0" : totalRevenue}
                  </h3>
                </div>
                <GiMoneyStack className="text-green-500 text-5xl" />
              </div>
            </div>
            <div>
              <button className="btn btn-secondary btn-md btn-outline" onClick={() => { navigate('/admin/payment-records', { state: { ...allPayments, ...activePaymentsWithUsers } }) }}>Payment Records</button>
            </div>
          </div>
        </div>

        {/* CRUD courses section */}
        <div className="mx-[10%] w-[80%] self-center flex flex-col items-center justify-center gap-10 mb-10">
          <div className="flex w-full items-center justify-between max-md:flex-col">
            <h1 className="text-center text-3xl font-semibold mb-4">
              Courses Overview
            </h1>

            {/* add course card */}
            <button
              onClick={() => {
                navigate("/course/create", {
                  state: {
                    initialCourseData: {
                      newCourse: true,
                      title: "",
                      category: "",
                      createdBy: "",
                      description: "",
                      thumbnail: undefined,
                      previewImage: "",
                    },
                  },
                });
              }}
              className="w-fit bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 rounded py-2 px-4 font-semibold text-lg cursor-pointer max-md:px-2 max-md:py-1 max-md:texl-sm"
            >
              Create New Course
            </button>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>S No.</th>
                  <th>Course Title</th>
                  <th>Course Category</th>
                  <th>Instructor</th>
                  <th>Total Lectures</th>
                  <th>Course Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {myCourses?.map((element, index) => {
                  return (
                    <tr key={element?._id || index}>
                      <td>{index + 1}</td>
                      <td>
                        {element?.title}
                      </td>
                      <td>{element?.category}</td>
                      <td>{element?.createdBy}</td>
                      <td>{element?.numberOfLectures}</td>
                      <td className="max-w-28 overflow-hidden text-ellipsis whitespace-nowrap">
                        <textarea
                          readOnly
                          className="p-2 w-full h-[10vh] bg-transparent resize-none"
                          value={element?.description}
                        ></textarea>
                      </td>

                      <td className="flex items-center gap-4">

                        {/* to delete the course */}
                        <button
                          onClick={() => handleCourseDelete(element._id)}
                          className="bg-red-500 hover:bg-red-600 transition-all ease-in-out duration-30 text-xl py-2 px-4 rounded-md font-bold max-md:px-2 max-md:py-1 max-md:texl-sm"
                        >
                          <BsTrash />
                        </button>

                        {/* to CRUD the lectures */}
                        <button
                          onClick={() =>
                            navigate("/course/displaylectures", {
                              state: { ...element },
                            })
                          }
                          className="bg-green-500 hover:bg-green-600 transition-all ease-in-out duration-30 text-xl py-2 px-4 rounded-md font-bold max-md:px-2 max-md:py-1 max-md:texl-sm"
                        >
                          <BsCollectionPlayFill />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
