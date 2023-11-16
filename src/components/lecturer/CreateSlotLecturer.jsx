import { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs"; // Sửa đổi import
import { NavLink } from "react-router-dom";
import { createSlot } from "../../api";
import moment from "moment";

export default function CreateSlotLecturer({userId}) {
  const zeroFormData = {
    code: "",
    date: "",
    endDatetime: "",
    lecturerId: parseInt(userId),
    limitBooking: 0,
    location: "",
    mode: "Public",
    startDatetime: "",
  };
  const [formData, setFormData] = useState(zeroFormData);

  const [errors, setErrors] = useState({});
  //thoong bao
  const [added, setAdded] = useState('');

  async function makePostRequest(form) {
    try {
      const response = await createSlot(form);
      setAdded(response)
    } catch (error) {}
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "limitBooking" ? parseInt(value, 10) : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = (e) => {
    console.log();
    e.preventDefault();
    console.log("create nè");
    // Validate the form
    const newErrors = validateForm();
    setErrors(newErrors);

    // If there are errors, do not proceed with the submission
    if (Object.keys(newErrors).length === 0) {
      console.log("tới đây r nè");
      // No validation errors, proceed with the submission
      console.log("Form submitted:", formData);
      makePostRequest({
        ...formData,
        date: `${formData.date}T00:00`,
        startDatetime: `1111-11-11T${formData.startDatetime}`,
        endDatetime: `1111-11-11T${formData.endDatetime}`,
      });
      setFormData(zeroFormData);
      // setAdded(true);
    }
  };

  const cancelAll = () => {
    setFormData(zeroFormData);
    setErrors([]);
    // setAdded(false);
  };
  const validateForm = () => {
    const newErrors = {};

    // Check if the location is not empty
    if (!formData.location) {
      newErrors.location = "Location is required";
    }
    // Check if date is not empty
    if (!formData.date) {
      newErrors.date = "Created At is required";
    } else {
      // Convert formData.date to a Date object for comparison
      const selectedDate = new Date(formData.date);
      const currentDate = new Date();
  
      // Compare the selected date with the current date
      if (selectedDate < currentDate.getDate) {
        newErrors.date = "Date must be equal to or greater than today";
      }
    }

    // Check if startDatetime is not empty
    if (!formData.startDatetime) {
      newErrors.startDatetime = "Start date and Time is required";
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
    if (formData.limitBooking > 35) {
      newErrors.limitBooking = "Limit must be smaller than 35";
    }

    // Check if mode is not empty
    if (!formData.mode) {
      newErrors.mode = "Mode is required";
    }

    // Add more validation rules for other fields as needed

    return newErrors;
  };

  return (
    <div className="min-h-[80%] flex flex-col bg-white">
      <div className="flex flex-row h-[10%]">
        <NavLink
          className="h-[10%]  font-bold flex flex-row gap-5 items-center"
          to="/Lecturer"
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
              <div className={`text-xl ${added==='Slot create successfully.'?'text-green-500':'text-red-500'} font-semibold`}>
                {added}
              </div>
            )}
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
                  value={formData.location} // Sử dụng giá trị từ formData
                  onChange={handleInputChange}
                  name="location"
                ></input>
              </div>
              {errors.location && (
                <div className="text-red-500 text-sm">{errors.location}</div>
              )}
              <div className="flex flex-row w-full items-center">
                <span className="text-xl font-medium w-[30%]">Date</span>
                <input
                  className={`border ${
                    errors.date ? "border-red-500 border-2" : "border-gray-900"
                  } rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
                  type="date" // Corrected type attribute
                  value={formData.date}
                  onChange={handleInputChange}
                  name="date" // Corrected name attribute
                ></input>
              </div>
              {errors.date && (
                <div className="text-red-500 text-sm">{errors.date}</div>
              )}
              <div className="flex flex-row w-full items-center">
                <span className="text-xl font-medium w-[30%]">Start Time</span>
                <input
                  className={`border ${
                    errors.startDatetime
                      ? "border-red-500 border-2"
                      : "border-gray-900"
                  } rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
                  type="time" // Corrected type attribute
                  value={formData.startDatetime}
                  onChange={handleInputChange}
                  name="startDatetime" // Corrected name attribute
                ></input>
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
                  type="time" // Corrected type attribute
                  value={formData.endDatetime}
                  onChange={handleInputChange}
                  name="endDatetime" // Corrected name attribute
                ></input>
              </div>
              {errors.endDatetime && (
                <div className="text-red-500 text-sm">{errors.endDatetime}</div>
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
                  value={formData.limitBooking} // Sử dụng giá trị từ formData
                  onChange={handleInputChange}
                  name="limitBooking"
                ></input>
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
                  value={formData.mode} // Sử dụng giá trị từ formData
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
                  value={formData.code} // Sử dụng giá trị từ formData
                  onChange={handleInputChange}
                  name="code"
                ></input>
              </div>
            </form>
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
          </div>
        </div>
      </div>
    </div>
  );
}
