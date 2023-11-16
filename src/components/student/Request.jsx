import { useEffect, useState } from "react";
import {
  createAccount,
  createRequest,
  getAllSubject,
  getAllUser,
} from "../../api";

export default function Request({ userId,chosePage }) {
  const zeroFormData = {
    lecturer: "",
    course: "",
    description: "",
  };
  const [formData, setFormData] = useState(zeroFormData);
  const [errors, setErrors] = useState({});
  const [added, setAdded] = useState(false);
  const [subjectList, setSubjectList] = useState([]);
  const [accountList, setAccountList] = useState([]);

  async function fetchData() {
    const response = await getAllSubject()
      .then((data) => setSubjectList(data))
      .catch((error) => console.log(error));
    console.log(subjectList);
    const response2 = await getAllUser()
      .then((data) =>
        setAccountList(data.filter((acc) => acc.role === "Lecturer"))
      )
      .catch((error) => console.log(error));
  }

  async function makePostRequest(form) {
    try {
      const response = await createRequest(form);
    } catch (error) {}
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    // Validate the form
    const newErrors = validateForm();
    setErrors(newErrors);
    console.log(formData);

    //xử lý form để cb truyền API.
    const submitData = {
      studentId: parseInt(userId),
      lecturerId: parseInt(searchLecturerName(formData.lecturer)),
      subjectId: parseInt(searchCourseName(formData.course)),
      description: formData.description,
    };
    console.log(submitData);
    // If there are errors, do not proceed with the submission
    if (Object.keys(newErrors).length === 0) {
      // No validation errors, proceed with the submission
      console.log("Form submitted:", formData);
      await makePostRequest(submitData);
      setFormData(zeroFormData)
      setAdded(true);
    }
  }
  //search
  const searchCourseName = (subjectCode) => {
    const course = subjectList.find(
      (course) => course.subjectCode === subjectCode
    );
    if (course) {
      return course.id;
    } else {
      return 0; // Return null if the course is not found
    }
  };

  const searchLecturerName = (lecturerName) => {
    const account = accountList.find((acc) => acc.fullname === lecturerName);
    if (account) {
      return account.id;
    } else {
      return 0; // Return null if the course is not found
    }
  };

  const cancelAll = (e) => {
    e.preventDefault();
    console.log(formData);
    setFormData(zeroFormData);
    setErrors([]);
    setAdded(false);
  };

  const validateForm = () => {
    const newErrors = {};

    // Check if lecturer is not empty
    if (!formData.lecturer) {
      newErrors.lecturer = "Lecturer name is required";
    } else if (searchLecturerName(formData.lecturer) === 0) {
      newErrors.lecturer = "Can't find this lecturer";
    }

    // Check if course is not empty
    if (!formData.course) {
      newErrors.course = "Course name is required";
    } else if (searchCourseName(formData.course) === 0) {
      newErrors.course = "Can't find this course";
    }
    // Check if description is not empty
    if (!formData.description) {
      newErrors.description = "Description is required";
    }

    // Add more validation rules for other fields as needed

    return newErrors;
  };

  useEffect(() => {
    chosePage("Request");
    fetchData();
  }, []);
  
  return (
    <div className="w-full h-full flex flex-col justify-center items-center  pb-10">
      <div className="w-[50%] h-fit mt-[5%] flex flex-col justify-center gap-3 items-start px-10 py-3 border-orange-400 border-4 rounded-md min-h-[20%]">
        <span className="font-semibold text-2xl mb-5">
          MEETING REQUEST FORM
        </span>
        {added&&(<div className="text-green-500">Create successfully!!!</div>)}
        <form className="w-[80%] mx-auto flex flex-col gap-5">
          <div className="flex flex-row w-full items-center">
            <span className="text-xl font-medium w-[30%]">Lecturer</span>
            <input
              name="lecturer"
              onChange={handleInputChange}
              value={formData.lecturer}
              className=" border border-gray-900 rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]"
              type="text"
            ></input>
          </div>
          {errors.lecturer && (
            <div className="text-red-500">{errors.lecturer}</div>
          )}
          <div className="flex flex-row w-full items-center">
            <span className="text-xl font-medium w-[30%]">Course</span>
            <input
              name="course"
              onChange={handleInputChange}
              value={formData.course}
              className=" border border-gray-900 rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]"
              type="text"
            ></input>
          </div>
          {errors.course && <div className="text-red-500">{errors.course}</div>}
          <div className="flex flex-row w-full items-start">
            <span className="text-xl font-medium w-[30%]">Description</span>
            <textarea
              onChange={handleInputChange}
              value={formData.description}
              name="description"
              className=" border border-gray-900 rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[20rem] h-[7rem]"
            ></textarea>
          </div>
          {errors.description && (
            <div className="text-red-500">{errors.description}</div>
          )}
          <div className="flex flex-row  w-full items-center justify-end gap-10">
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
              Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
