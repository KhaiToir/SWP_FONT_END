import { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import {
  baseURL,
  createBooking,
  createSlot,
  getAllSlotByLecturerID,
  searchRequestById,
} from "../../api";
import moment from "moment";
import axios from "axios";

export default function CreateRequestSlot({ userId }) {
  const { id } = useParams();
  const zeroFormData = {
    location: "",
    date: "",
    endDatetime: "",
    startDatetime: "",
    limitBooking: 0,
    mode: "Public",
    code: "",
    lecturerId: userId,
  };
  const [formData, setFormData] = useState(zeroFormData);
  const [errors, setErrors] = useState({});
  const [added, setAdded] = useState(false);
  const [inforDetail, setInforDetail] = useState({});
  const [bookingRooms, setBookingRooms] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const copyInforDetailToFormData = () => {
    setFormData({
      lecturerId: parseInt(userId),
      location: "",
      code: "",
      limitBooking: "",
      mode: "Public",
      date: moment(inforDetail.startDatetime).format("YYYY-MM-DD"),
      endDatetime: moment(inforDetail.endDatetime).format("HH:mm"),
      startDatetime: moment(inforDetail.startDatetime).format("HH:mm"),
    });
  };

  async function fetchData(slotId) {
    try {
      const data = await searchRequestById(parseInt(slotId));
      setInforDetail(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchDataSlot(slotId) {
    try {
      const data = await getAllSlotByLecturerID(parseInt(slotId));
      const filteredData = data.filter(
        (slot) => slot.status !== "Unactive"
      );
      setBookingRooms(filteredData);
    } catch (error) {
      console.log(error);
    }
  }

  async function makePostRequest(form) {
    try {
      await createSlot(form);
    } catch (error) {
      console.log(error);
    }
  }

  async function makePostBooking(form) {
    try {
      await createBooking(form);
    } catch (error) {
      console.log(error);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "limitBooking" ? parseInt(value, 10) : value;
    setFormData({ ...formData, [name]: newValue });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    const newErrors = validateForm();
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      try {
        // Create a new slot
        const slotResponse = await axios.post(`${baseURL}/Booking`,{
          ...formData,
          date: `${formData.date}T00:00`,
          startDatetime: `1111-11-11T${formData.startDatetime}`,
          endDatetime: `1111-11-11T${formData.endDatetime}`,
        });
  
        // After creating the slot, fetch the updated list of slots
        await fetchDataSlot(parseInt(userId));
  
        // Use the updated data to find the newly created slot
        const newlyCreatedSlot = bookingRooms.find(slot => slot.id === slotResponse.id);
  
        if (newlyCreatedSlot) {
          // Create a booking with the newly created slot
          await makePostBooking({
            studentId: parseInt(inforDetail.studentId),
            slotId: newlyCreatedSlot.id,
            subjectId: parseInt(inforDetail.subjectId),
            description: inforDetail.description,
            status: "Success",
          });
  
          setRefresh(true);
          setFormData({
            ...zeroFormData,
            date: "",
            endDatetime: "",
            startDatetime: "",
          });
          setAdded(true);
        }
      } catch (error) {
        // Handle any errors that may occur during API requests
        console.error(error);
      }
    }
  }
  

  const cancelAll = () => {
    setFormData(zeroFormData);
    setErrors([]);
    setAdded(false);
  };

  const validateForm = () => {
    const newErrors = {};

    // Check if the location is not empty
    if (!formData.location) {
      newErrors.location = "Location is required";
    }
    // Check if date is not empty
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      // Convert formData.date to a Date object for comparison
      const selectedDate = moment(formData.date, "YYYY-MM-DD");
      const currentDate = moment();

      // Compare the selected date with the current date
      if (selectedDate.isBefore(currentDate, "day")) {
        newErrors.date = "Date must be equal to or greater than today";
      }
    }

    // Check if startDatetime is not empty
    if (!formData.startDatetime) {
      newErrors.startDatetime = "Start Date and Time is required";
    }

    // Check if endDatetime is not empty
    if (!formData.endDatetime) {
      newErrors.endDatetime = "End Date and Time is required";
    } else {
      const start = moment(formData.startDatetime, "HH:mm");
      const end = moment(formData.endDatetime, "HH:mm");

      const timeDifference = end.diff(start, "minutes"); // Difference in minutes

      // Check if endDatetime is at least 15 minutes greater than startDatetime
      if (timeDifference < 15) {
        newErrors.endDatetime =
          "End Date and Time must be at least 15 minutes greater than Start Time";
      }

      // Check if endDatetime is no more than 3 hours greater than startDatetime
      if (timeDifference > 180) {
        newErrors.endDatetime =
          "End Date and Time must be no more than 3 hours greater than Start Time";
      }
    }

    // Check if limitBooking is a number
    if (isNaN(formData.limitBooking)) {
      newErrors.limitBooking = "Limit must be a number";
    }
    if (!formData.limitBooking) {
      newErrors.limitBooking = "Limit is required";
    }
    if (formData.limitBooking <= 0) {
      newErrors.limitBooking = "Limit must be more than 0";
    }

    // Check if mode is not empty
    if (!formData.mode) {
      newErrors.mode = "Mode is required";
    }

    // Add more validation rules for other fields as needed

    return newErrors;
  }

  useEffect(() => {
    if (id !== "0") {
      fetchData(id);
      fetchDataSlot(parseInt(userId));
    }
  }, [id]);

  useEffect(() => {
    if (id !== "0") {
      if (inforDetail) {
        copyInforDetailToFormData();
      }
    }
  }, [inforDetail, id]);

  return (
    <div className="min-h-[80%] flex flex-col bg-white">
      <div className="flex flex-row h-[10%]">
        <NavLink
          className="h-[10%] font-bold flex flex-row gap-5 items-center"
          to="/Lecturer/Request"
        >
          <span className="text-4xl">
            <BsArrowLeft />
          </span>{" "}
          <span className="text-2xl underline">Home</span>
        </NavLink>
        <div className="w-full flex justify-center items-center">
          <div className="w-[50%] h-fit mt-[5%] flex flex-col justify-center gap-3 items-start px-10 py-3 border-orange-400 border-4 rounded-md min-h-[20%] ">
            <span className="font-semibold text-2xl mb-5">
              Create Booking Slot
            </span>
            {added && (
              <div className="text-xl text-green-500 font-semibold">
                Create successfully!
              </div>
            )}
            {refresh === false && (
              <form className="w-[80%] mx-auto flex flex-col gap-5">
                <div className="flex flex-row w-full items-center">
                  <span className="text-xl font-medium w-[30%]">Location</span>
                  <input
                    className={`border ${
                      errors.location
                        ? "border-red-500 border-2"
                        : "border-gray-900"
                    } rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    name="location"
                  />
                </div>
                {errors.location && (
                  <div className="text-red-500 text-sm">{errors.location}</div>
                )}
                <div className="flex flex-row w-full items-center">
                  <span className="text-xl font-medium w-[30%]">Date</span>
                  <input
                    className={`border ${
                      errors.date
                        ? "border-red-500 border-2"
                        : "border-gray-900"
                    } rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    name="date"
                  />
                </div>
                {errors.date && (
                  <div className="text-red-500 text-sm">{errors.date}</div>
                )}
                <div className="flex flex-row w-full items-center">
                  <span className="text-xl font-medium w-[30%]">
                    Start Time
                  </span>
                  <input
                    className={`border ${
                      errors.startDatetime
                        ? "border-red-500 border-2"
                        : "border-gray-900"
                    } rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
                    type="time"
                    value={formData.startDatetime}
                    onChange={handleInputChange}
                    name="startDatetime"
                  />
                </div>
                {errors.startDatetime && (
                  <div className="text-red-500 text-sm">
                    {errors.startDatetime}
                  </div>
                )}
                <div className="flex flex-row w-full items-center">
                  <span className="text-xl font-medium w-[30%]">End Time</span>
                  <input
                    className={`border ${
                      errors.endDatetime
                        ? "border-red-500 border-2"
                        : "border-gray-900"
                    } rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
                    type="time"
                    value={formData.endDatetime}
                    onChange={handleInputChange}
                    name="endDatetime"
                  />
                </div>
                {errors.endDatetime && (
                  <div className="text-red-500 text-sm">
                    {errors.endDatetime}
                  </div>
                )}
                <div className="flex flex-row w-full items-center">
                  <span className="text-xl font-medium w-[30%]">Limit</span>
                  <input
                    className={`border ${
                      errors.limitBooking
                        ? "border-red-500 border-2"
                        : "border-gray-900"
                    } rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
                    type="number"
                    value={formData.limitBooking}
                    onChange={handleInputChange}
                    name="limitBooking"
                  />
                </div>
                {errors.limitBooking && (
                  <div className="text-red-500 text-sm">
                    {errors.limitBooking}
                  </div>
                )}
                <div className="flex flex-row w-full items-center">
                  <span className="text-xl font-medium w-[30%]">Mode</span>
                  <select
                    className={`border border-gray-900 rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
                    name="mode"
                    value={formData.mode}
                    onChange={handleInputChange}
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
                <div className="flex flex-row w-full items-center">
                  <span className="text-xl font-medium w-[30%]">Code</span>
                  <input
                    className={`border border-gray-900 rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
                    type="text"
                    value={formData.code}
                    onChange={handleInputChange}
                    name="code"
                  />
                </div>
                <div className="flex flex-row w-full items-center justify-center gap-10">
                  <button
                    className="text-white bg-red-500 px-3 py-2 rounded-xl border-black border-2"
                    onClick={cancelAll}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-white bg-green-500 px-3 py-2 rounded-xl border-black border-2"
                    onClick={handleSubmit}
                  >
                    Create
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
