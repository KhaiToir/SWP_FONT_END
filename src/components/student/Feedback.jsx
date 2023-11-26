import { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs"; // Sửa đổi import
import { NavLink, useParams } from "react-router-dom";
import {
  searchTeacherById,
  searchSubjectById,
  createFeedback,
} from "../../api";
import moment from "moment";

export default function CreateSlotLecturer() {
  const data = useParams();
  const zeroFormData = {
    comment: "",
  };
  const [formData, setFormData] = useState(zeroFormData);
  const [formId, setFormId] = useState("");
  const [lecturerName, setLecturerName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [inforDetail, setInforDetail] = useState(JSON.parse(data.infor));
  const [errors, setErrors] = useState({});
  const [added, setAdded] = useState("");

  console.log(inforDetail);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const makePostRequest = async (form) => {
    try {
      const response = await createFeedback(form);
      setAdded(response);
    } catch {
      console.log("Error");
    }
  };
  const searchLecturerName = async (lecturerId) => {
    const response = await searchTeacherById(parseInt(lecturerId))
      .then((data) => setLecturerName(data.fullname))
      .catch((error) => console.log(error));
  };
  const searchCourseName = async (courseId) => {
    const response = await searchSubjectById(parseInt(courseId))
      .then((data) => setCourseName(data.name))
      .catch((error) => console.log(error));
  };

  searchLecturerName(inforDetail.lecturerId);
  searchCourseName(inforDetail.subjectId);
  async function handleUpdate(e) {
    e.preventDefault();
    // Validate the form
    const newErrors = validateForm();
    setErrors(newErrors);

    // If there are errors, do not proceed with the submission
    if (Object.keys(newErrors).length === 0) {
      // No validation errors, proceed with the submission
      console.log("Form submitted:", {
        bookingId: inforDetail.bookedId,
        comment: formData.comment,
      });

      await makePostRequest({
        bookingId: inforDetail.bookedId,
        comment: formData.comment,
      });
      setFormData(formData);
    }
  }

  const cancelAll = () => {
    setFormData(zeroFormData);
    setErrors([]);
    setAdded("");
  };
  const validateForm = () => {
    const newErrors = {};

    // Check if the location is not empty
    if (!formData.comment) {
      newErrors.comment = "Comment is required";
    }

    return newErrors;
  };

  return (
    <div className="min-h-[80%] flex flex-col bg-white">
      <div className="flex flex-row h-[10%]">
        <NavLink
          className="h-[10%]  font-bold flex flex-row gap-5 items-center"
          to="/student/History"
        >
          <span className="text-4xl">
            <BsArrowLeft />
          </span>{" "}
          <span className="text-2xl underline">Back</span>
        </NavLink>
        <div className="w-full flex justify-center items-center">
          <div className="w-[50%] h-fit mt-[5%] flex flex-col justify-center gap-3 items-start px-10 py-3 border-orange-400 border-4 rounded-md min-h-[20%] ">
            <span className="font-semibold text-2xl mb-5">FEEDBACK FORM</span>

            <div className={`text-xl ${added==='Feedback create successfully.'?'text-green-500':'text-red-500'} font-semibold`}>{added}</div>

            <form className="w-[80%] mx-auto flex flex-col gap-5">
              <div className="flex flex-row w-full items-center">
                <span className="text-xl font-medium w-[30%]">Lecturer</span>
                <input
                  readOnly
                  className={`border border-gray-900 rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
                  type="text"
                  value={lecturerName} // Sử dụng giá trị từ formData
                ></input>
              </div>
              <div className="flex flex-row w-full items-center">
                <span className="text-xl font-medium w-[30%]">Course</span>
                <input
                  readOnly
                  className={`border border-gray-900 rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
                  type="text"
                  value={courseName} // Sử dụng giá trị từ formData
                ></input>
              </div>
              <div className="flex flex-row w-full items-center">
                <span className="text-xl font-medium w-[30%]">Location</span>
                <input
                  readOnly
                  className={`border border-gray-900 rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
                  type="text"
                  value={inforDetail.location} // Sử dụng giá trị từ formData
                ></input>
              </div>
              <div className="flex flex-row w-full items-center">
                <span className="text-xl font-medium w-[30%]">Time</span>
                <input
                  readOnly
                  className={`border border-gray-900 rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
                  type="text"
                  value={
                    moment(inforDetail.startDatetime).format("HH:mm") +
                    "-" +
                    moment(inforDetail.endDatetime).format("HH:mm")
                  }
                ></input>
              </div>
              <div className="flex flex-row w-full items-center">
                <span className="text-xl font-medium w-[30%]">Date</span>
                <input
                  readOnly
                  className={`border border-gray-900 rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
                  type="text" // Corrected type attribute
                  value={moment(inforDetail.startDatetime).format("DD-MM-YYYY")}
                ></input>
              </div>
              {errors&&(<span className="text-red-500 font-semibold">{errors.comment}</span>)}
              <div className="flex flex-row w-full">
                <span className="text-xl font-medium w-[30%]">Comment</span>
                <textarea
                  className={`border h-[8.5rem] border-gray-900 rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
                  value={formData.comment}
                  name="comment" // Corrected name attribute
                  onChange={handleInputChange}
                ></textarea>
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
                onClick={handleUpdate}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
