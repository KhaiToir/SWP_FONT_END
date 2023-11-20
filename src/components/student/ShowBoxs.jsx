import { useEffect, useState } from "react";
import { LuLock } from "react-icons/lu";

import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import {
  createBooking,
  createBookingByCode,
  deleteBookingtById,
} from "../../api";
import Popup from "reactjs-popup";
export default function ShowBoxs({ childArray, setRefresh, type, userId }) {
  const [showInformations, setShowInformations] = useState();
  const [clickBook, setClickBook] = useState("");

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [added, setAdded] = useState(false);
  const [denided, openDenied] = useState("");
  const [codeError, setCodeError] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteHolder, setDeleteHolder] = useState("");

  const closeModal = () => {
    setOpenDelete(false);
  };
  function handleDelete(id) {
    setOpenDelete((open) => !open);
    setDeleteHolder(id);
  }

  async function handleDeleteYes() {
    if (deleteHolder !== 0) {
      try {
        console.log(deleteHolder);
        await makeDeleteRequest(parseInt(deleteHolder));
        // If the deletion is successful, you can update the local state.
        setDeleteHolder(0);
        setOpenDelete(false);
        setRefresh(true);
      } catch (error) {
        // Handle the error
        console.error("Error deleting account:", error);
      }
    }
  }

  async function makePostRequest(form) {
    try {
      const response = await createBooking(form);
      setCodeError(response);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  async function makePostRequestByCode(form) {
    try {
      const response = await createBookingByCode(form);
      console.log(response);
      setCodeError(response);
    } catch (error) {
      // Handle other errors such as network issues
      console.error("Error:", error);
    }
  }
  async function makeDeleteRequest(bookingId) {
    try {
      const response = await deleteBookingtById(bookingId);
    } catch (error) {
      console.log(error);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    // Check if either code or (subjectCode and description) is provided
    if (!(formData.code || (formData.subjectCode && formData.description))) {
      newErrors.description =
        "Either Code or (Subject Code and Description) is required";
      newErrors.code =
        "Either Code or (Subject Code and Description) is required";
    } else {
      // If subjectCode is provided, validate it
      if (formData.subjectCode) {
        if (parseInt(formData.subjectCode) === 0) {
          newErrors.subjectCode = "Can't find this course";
        }
      }

      // If description is provided, validate it
      if (formData.description) {
        if (/^\d/.test(formData.description)) {
          newErrors.description = "Description cannot start with a number";
        }
      }
    }

    return newErrors;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    // Validate the form
    console.log("tới đây r");
    console.log(formData);

    if (formData.description && !formData.code) {
      const submitData = {
        studentId: parseInt(userId),
        slotId: parseInt(clickBook),
        subjectId: parseInt(formData.subjectCode),
        description: formData.description,
        status: "",
      };
      console.log("SubmitData:", submitData);
      const newErrors = validateForm();
      setErrors(newErrors);

      // If there are errors, do not proceed with the submission
      if (Object.keys(newErrors).length === 0) {
        // No validation errors, proceed with the submission
        console.log("Form submitted:", submitData);
        await makePostRequest(submitData);
        setAdded(true);
        setRefresh(true);
      }
    } else if (formData.code) {
      console.log("code");
      const submitData = {
        studentId: parseInt(userId),
        slotId: parseInt(clickBook),
        subjectId: parseInt(formData.subjectCode),
        code: formData.code,
        status: "Pending",
      };
      console.log("SubmitData:", submitData);
      const newErrors = validateForm();
      setErrors(newErrors);
      // If there are errors, do not proceed with the submission
      if (Object.keys(newErrors).length === 0) {
        // No validation errors, proceed with the submission
        console.log("Form submitted:", submitData);
        await makePostRequestByCode(submitData);
        setAdded(true);
        setRefresh(true);
      }
    }
  }

  useEffect(() => {
    if (type === "History") {
      setShowInformations(
        childArray.map((slot) => ({
          ...slot,
          status:
            slot.denided && slot.denided.length > 0
              ? "Denided"
              : slot.status === "Finish"
              ? (slot.status = "Feedback")
              : slot.status,
        }))
      );
    } else {
      setShowInformations(childArray);
    }
  }, [childArray]);
  console.log(showInformations);
  const navigate = useNavigate();

  function handleClick(e, infor) {
    handleClose();
    const key = e.target.value;
    console.log(key);
    if (key === "Feedback") {
      navigate(
        //nhảy qua feedback  + dữ liệu infor
        "/student/Feedback/" + encodeURIComponent(JSON.stringify(infor))
      );
    }
    if (key === "Not Book") {
      setClickBook(infor.id);
    }
    if (key === "Denided") {
      openDenied(infor.id);
    }
    if (key === "Cancel") {
      handleDelete(infor?.bookedId);
    }
  }

  function handleClose() {
    setClickBook(0);
    setAdded(false);
    setFormData({});
    setCodeError("");
  }

  return (
    <div className="w-full pb-10 right-0 left-0 gap-[5%] flex flex-row flex-wrap h-full relative bg-white">
      {showInformations && showInformations.length === 0 && (
        <div className="w-full font-bold text-2xl">
          THERE ARE NO SLOT HERE!!!!
        </div>
      )}
      {showInformations &&
        showInformations.map((infor) => (
          <div
            key={infor.id}
            className="relative w-[30%] h-fit mt-[5%] flex flex-col justify-center gap-3 items-start px-10 py-3 border-orange-400 border-4 rounded-md min-h-[20%]"
          >
            {infor.code && (
              <div className="absolute top-0 right-0 text-3xl p-2">
                <LuLock />
              </div>
            )}
            {infor?.lecturerInfor?.fullname && (
              <span className="font-bold text-xl w-full flex justify-center">
                {infor?.lecturerInfor.fullname}
              </span>
            )}
            {infor.Course && (
              <span className="text-xl">Course: {infor.Course}</span>
            )}
            {infor.location && (
              <span className="text-xl">Location: {infor.location}</span>
            )}
            {infor.startDatetime && infor.endDatetime && (
              <span className="text-xl">
                Time: {moment(infor.startDatetime).format("HH:mm")}-
                {moment(infor.endDatetime).format("HH:mm")}
              </span>
            )}
            {infor.startDatetime && (
              <span className="text-xl">
                Date: {moment(infor.startDatetime).format("DD/MM/YYYY")}
              </span>
            )}
            {infor.limitBooking && (
              <span className="text-xl">
                Limit: {infor.bookingId.length}/{infor.limitBooking}
              </span>
            )}
            <div className="w-full flex flex-row justify-center relative items-center gap-5">
              {type === "History" ? (
                <div
                  className={`absolute -left-4 ${
                    infor.denided && infor.denided.length > 0
                      ? "bg-red-500"
                      : infor.status === "Finish"
                      ? "bg-blue-500"
                      : "bg-green-500"
                  } py-[0.3rem] px-[0.6rem] rounded-xl text-xs text-white`}
                >
                  {infor.denided && infor.denided.length > 0
                    ? "Denided"
                    : infor.status === "Finish"
                    ? "Finish"
                    : "Booked"}
                </div>
              ) : (
                <></>
              )}
              <button
                className={`text-white  p-3 w-[8rem] rounded-3xl font-bold
            ${
              (type === "Pending"
                ? infor.status === "Not Book" && "Cancel"
                : infor.status) === "Cancel"
                ? "bg-red-500"
                : infor.status === "Booked"
                ? "bg-green-500"
                : infor.status === "Not Book"
                ? "bg-blue-500"
                : infor.status === "Feedback"
                ? "bg-blue-700"
                : infor.status === "Denided"
                ? "bg-red-500"
                : "bg-black"
            }`}
                value={
                  type === "Pending"
                    ? infor.status === "Not Book" && "Cancel"
                    : infor.status
                }
                onClick={(e) => handleClick(e, infor)}
              >
                {type === "Pending"
                  ? infor.status === "Not Book"
                    ? "Cancel"
                    : infor.status
                  : infor.status === "Not Book"
                  ? "Book"
                  : infor.status}
              </button>
            </div>
            {clickBook === infor.id && (
              <div
                className={`flex flex-col items-end absolute ${
                  infor.code !== "" ? "-bottom-[6rem]" : "-bottom-[8.5rem]"
                } w-full border-2 left-0 min-h-[5rem] border-black bg-white z-50 opacity-80 px-5 py-1 pb-5`}
              >
                <button className="text-2xl w-fit" onClick={handleClose}>
                  &times;
                </button>
                {infor.code !== "" ? (
                  <form className="flex flex-col gap-3 justify-end items-end relative w-full">
                    <div
                      className={`w-full text-left font-semibold ${
                        codeError === "Booked succesfully!!!"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {codeError}
                    </div>
                    <div className="flex flex-row justify-between items-center w-full">
                      <span>Course:</span>
                      <select
                        name="subjectCode"
                        onChange={handleInputChange}
                        className={`border-2 w-[11rem] ${
                          errors.subjectCode
                            ? "border-red-500 "
                            : "border-gray-900"
                        } `}
                        value={formData.subjectCode}
                      >
                        <option
                          value={0}
                          label="Chose subject."
                          selected
                        ></option>
                        {infor?.subjectRequired&&infor?.subjectRequired.map((sub) => (
                          <option
                            value={parseInt(sub.id)}
                            label={sub.subjectCode}
                          />
                        ))}
                      </select>
                    </div>
                    {errors.subjectCode && (
                      <div className="text-red-500 text-sm">
                        {errors.subjectCode}
                      </div>
                    )}
                    <div className="flex flex-row justify-between items-center w-full">
                      <span>Code:</span>
                      <input
                        name="code"
                        onChange={handleInputChange}
                        className={`border-2 w-[11rem] ${
                          errors.code
                            ? "border-red-500 border-2"
                            : "border-gray-900"
                        } `}
                        value={formData.code}
                      />
                    </div>
                    {errors.code && (
                      <div className="text-red-500 text-sm">{errors.code}</div>
                    )}
                    <button
                      className=" border border-black px-2 bg-cyan-400 text-white"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </form>
                ) : (
                  <form className="flex flex-col gap-3 justify-end items-end relative w-full">
                    <div
                      className={`w-full text-left font-semibold ${
                        codeError === "Booked succesfully!!!"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {codeError}
                    </div>
                    <div className="flex flex-col gap-3 justify-end items-start w-full">
                      <div className="flex flex-row justify-between items-center w-full">
                        <span>Course:</span>
                        <select
                          name="subjectCode"
                          onChange={handleInputChange}
                          className={`border-2 w-[11rem] ${
                            errors.subjectCode
                              ? "border-red-500 "
                              : "border-gray-900"
                          } `}
                          value={formData.subjectCode}
                        >
                          <option
                            value={0}
                            label="Chose subject."
                            selected
                          ></option>
                          {infor?.subjectRequired&&infor?.subjectRequired.map((sub, index) => (
                            <option
                              key={index}
                              value={parseInt(sub.id)}
                              label={sub.subjectCode}
                            />
                          ))}
                        </select>
                      </div>
                      {errors.subjectCode && (
                        <div className="text-red-500 text-sm">
                          {errors.subjectCode}
                        </div>
                      )}
                      <div className="flex flex-row justify-between items-center w-full ">
                        <span>Description:</span>
                        <input
                          name="description"
                          onChange={handleInputChange}
                          className={`border-2 w-[11rem] ${
                            errors.description
                              ? "border-red-500"
                              : "border-gray-900"
                          } `}
                          value={formData.description}
                        />
                      </div>
                      {errors.description && (
                        <div className="text-red-500 text-sm">
                          {errors.description}
                        </div>
                      )}
                    </div>
                    <button
                      className=" border border-black px-2 bg-cyan-400 text-white"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </form>
                )}
              </div>
            )}
            {denided === infor.id && (
              <div
                className={`flex flex-col items-end absolute -bottom-[4rem] w-full border-2 left-0 min-h-[5rem] border-black bg-white z-50 opacity-80 px-5 py-1 pb-5`}
              >
                <button
                  className="text-2xl w-fit"
                  onClick={() => openDenied("")}
                >
                  &times;
                </button>
                <div className="flex flex-col gap-3 justify-endrelative w-full ">
                  <span className=""> Reason: {infor.denided}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      <Popup open={openDelete} closeOnDocumentClick onClose={closeModal}>
        <div className="modal">
          <button className="close" onClick={closeModal}>
            &times;
          </button>
          <div className="header font-bold text-xl">
            {" "}
            Are you sure want to do this!!!
          </div>
          <div className="flex flex-row justify-center items-center h-[5rem] gap-20">
            <button
              className="w-[25%] text-base border rounded-xl p-2 border-black font-medium bg-green-500"
              onClick={handleDeleteYes}
            >
              Yes, Im sure!!!
            </button>
            <button
              className="w-[25%] text-base border rounded-xl p-2 border-black font-medium bg-red-500"
              onClick={closeModal}
            >
              No, Im not.
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
}