import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { LuPlusCircle } from "react-icons/lu";
import "../../cssstyles/popupStyles.css";
import { createCourse, deleteSubjectById, updateCourseById } from "../../api";

export default function AdminListCourse({ course, setRefresh,chosePage }) {
  //form mẫu
  const zeroFormData = {
    subjectCode: "",
    name: "",
  };
  const [courseList, setCourseList] = useState([]);
  const [showList, setShowList] = useState([]);
  const [searchComponent, setSearchComponent] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [deleteHolder, setDeleteHolder] = useState();
  const [updateHolder, setUpdateHolder] = useState();
  const [formData, setFormData] = useState(zeroFormData);
  const [errors, setErrors] = useState({});
  const [added, setAdded] = useState(false);
  const [updated, setUpdated] = useState(false);
  //function xử lý khi input vào form.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  //function validate các input đã nhập trước khi gửi request đến API.
  const validateForm = () => {
    const newErrors = {};
    // Check if the subjectCode is not empty and more child validation
    if (!formData.subjectCode) {
      newErrors.subjectCode = "Course's code is required";
    } else if (/^\d/.test(formData.subjectCode)) {
      newErrors.subjectCode = "Course's code cannot start with a number";
    } else if (formData.subjectCode !== formData.subjectCode.toUpperCase()) {
      newErrors.subjectCode = "Course's code must be in uppercase";
    }
    // Check if the subject name is not empty and more child validation
    if (!formData.name) {
      newErrors.name = "Course's name is required";
    } else if (/^\d/.test(formData.name)) {
      newErrors.name = "Course's name cannot start with a number";
    }
    // Add more validation rules for other fields as needed
    return newErrors;
  };
  //function gửi yêu cầu create subject đến API.
  async function makePostRequest(form) {
    try {
      const response = await createCourse(form);
    } catch (error) {
      console.log(error);
    }
  }
  //function gửi yêu cầu update subject đến API.
  async function makePutRequest(form, id) {
    try {
      const response = await updateCourseById(form, id);
    } catch (error) {
      console.log(error);
    }
  }
  //function gửi yêu cầu delete subject đến API.
  async function makeDeleteRequest(subjectId) {
    try {
      const response = await deleteSubjectById(subjectId);
    } catch (error) {
      console.log(error);
    }
  }
  //function xử lý khi bấm submit create.
  async function handleSubmitCreate(e) {
    e.preventDefault();

    // Validate the form
    const newErrors = validateForm();
    setErrors(newErrors);

    // If there are errors, do not proceed with the submission
    if (Object.keys(newErrors).length === 0) {
      // No validation errors, proceed with the submission
      console.log("Form submitted:", formData);
      await makePostRequest(formData);
      setFormData(zeroFormData);
      setAdded(true);
      setRefresh(true);
    }
  }
  //function xử lý khi bấm submit update.
  async function handleSubmitUpdate(e) {
    e.preventDefault();

    // Validate the form
    const newErrors = validateForm();
    setErrors(newErrors);

    // If there are errors, do not proceed with the submission
    if (Object.keys(newErrors).length === 0) {
      // No validation errors, proceed with the submission
      console.log("Form submitted:", formData);
      await makePutRequest(formData, updateHolder.id);
      setUpdateHolder({ ...formData, id: updateHolder.id });
      setFormData(formData);
      setUpdated(true);
      setRefresh(true);
    }
  }
  //function xử lý khi bấm agree delete.
  function handleDeleteYes() {
    if (deleteHolder !== 0) {
      try {
        console.log(deleteHolder);
        makeDeleteRequest(deleteHolder);
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
  //function xử lý khi bấm cancel create.
  const cancelAllCreate = (e) => {
    e.preventDefault();
    setFormData(zeroFormData);
    setErrors([]);
    setAdded(false);
  };
  //function xử lý khi bấm cancel update.
  const cancelAllUpdate = (e) => {
    e.preventDefault();
    setFormData({
      subjectCode: updateHolder.subjectCode,
      name: updateHolder.name,
    });
    setErrors([]);
    setAdded(false);
  };
  //function xử lý khi bấm vào vùng ngoài popup.
  const closeModal = () => {
    setOpenDelete(false);
    setOpenCreate(false);
    setOpenUpdate(false);
    setFormData(zeroFormData);
    setDeleteHolder();
    setUpdateHolder({});
    setAdded(false);
    setUpdated(false);
  };

  useEffect(() => {
    chosePage('Course')
    setCourseList(course);
    setShowList(course);
    console.log(courseList);
  }, [course]);
  //function xử lý khi bấm search button.
  function searchHandleClick(e) {
    e.preventDefault();
    setShowList(
      courseList.filter(
        (obj) =>
          obj.name.toLowerCase().includes(searchComponent.toLowerCase()) ||
          obj.subjectCode.toLowerCase().includes(searchComponent.toLowerCase())
      )
    );
  }
  //function xử lý khi bấm delete 1 tài khoản.
  function handleDelete(id) {
    setOpenDelete((open) => !open);
    setDeleteHolder(id);
  }
  //function xử lý khi bấm create button.
  function handleCreate(e) {
    e.preventDefault();
    setOpenCreate((open) => !open);
  }
  //function xử lý khi bấm vào update button.
  function handleUpdate(subject, e) {
    setOpenUpdate((open) => !open);
    setUpdateHolder(subject);
    setFormData({
      subjectCode: subject.subjectCode,
      name: subject.name,
    });
  }

  return (
    <div className="w-full max-w-full h-full flex flex-col justify-center items-center gap-5 py-5">
      <div className="w-[90%] mx-auto flex flex-col gap-10 py-10 pb-20">
        <div>
          <span className="font-bold text-3xl underline">
            List of Course: {showList && showList.length}
          </span>
        </div>
        <div className="">
          <form className="flex flex-row gap-10 w-3/4">
            <input
              value={searchComponent}
              onChange={(e) => setSearchComponent(e.target.value)}
              placeholder="Search by name or code"
              className="bg-gray-100 placeholder:text-gray-400 rounded-3xl placeholder:font-semibold w-[40%] text-center p-2"
            ></input>
            <button
              className="bg-orange-400 text-white rounded-3xl w-fit px-5"
              onClick={(e) => searchHandleClick(e)}
            >
              Search
            </button>
            <div className="w-[]  justify-center items-center flex text-5xl text-gray-400">
              <button onClick={(e) => handleCreate(e)}>
                <LuPlusCircle />
              </button>
            </div>
          </form>
        </div>
        <table className="w-full ">
          <thead>
            <tr>
              <th className="text-xl p-3 font-semibold bg-gray-300 border-black border-r-2">
                ID
              </th>
              <th className="text-xl p-3 font-semibold  bg-gray-300 border-black border-r-2">
                Name
              </th>
              <th className="text-xl p-3 font-semibold bg-gray-300 border-black border-r-2">
                Subject
              </th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {showList &&
              showList.map((info, index) => (
                <tr className="bg-gray-200" key={info.id}>
                  <td className="text-center font-medium text-lg p-2 border-black border-r-2">
                    {info.id}
                  </td>
                  <td className="text-center font-medium text-lg p-2 border-black border-r-2">
                    {info.name}
                  </td>
                  <td className="text-center font-medium text-lg p-2 border-black border-r-2">
                    {info.subjectCode}
                  </td>
                  <td className="text-center font-medium text-lg p-2 border-black border-r-2">
                    <button
                      className="  text-gray-500"
                      onClick={() => handleUpdate(info)}
                    >
                      Update
                    </button>
                  </td>
                  <td className="text-center font-medium text-lg p-2 border-black border-r-2">
                    <button
                      className="  text-red-500"
                      onClick={() => handleDelete(info.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {/* Delete Popup */}
        <Popup open={openDelete} closeOnDocumentClick onClose={closeModal}>
          <div className="modal">
            <button className="close" onClick={closeModal}>
              &times;
            </button>
            <div className="header font-bold text-xl">
              {" "}
              Are you sure want to delete this course!!!
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
        {/* Create Popup */}
        <Popup open={openCreate} closeOnDocumentClick onClose={closeModal}>
          <div className="modal">
            <button className="close" onClick={closeModal}>
              &times;
            </button>
            <div className="header font-bold text-3xl"> Create Course!!!</div>
            <div className="content">
              {added && (
                <div className="w-full text-green-500 font-semibold text-xl">
                  Adding successfully!!!
                </div>
              )}
              <form className="w-full flex justify-center flex-col gap-5 items-center min-h-[10rem]">
                <div className="flex flex-row w-full items-center justify-center">
                  <span className="text-xl font-medium w-[30%]">
                    Course's Name:
                  </span>
                  <input
                    className={`border ${
                      errors.name
                        ? "border-red-500 border-2"
                        : "border-gray-900"
                    }  rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
                    onChange={handleInputChange}
                    type="text"
                    value={formData.name}
                    name="name"
                  ></input>
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xl ">{errors.name}</p>
                )}
                <div className="flex flex-row w-full items-center justify-center">
                  <span className="text-xl font-medium w-[30%]">
                    Course's Subject
                  </span>
                  <input
                    className={`border  ${
                      errors.subjectCode
                        ? "border-red-500 border-2"
                        : "border-gray-900"
                    }  rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
                    onChange={handleInputChange}
                    type="text"
                    value={formData.subjectCode}
                    name="subjectCode"
                  ></input>
                </div>
                {errors.subjectCode && (
                  <p className="text-red-500 text-xl ">{errors.subjectCode}</p>
                )}
                <div className="flex flex-row gap-20 ">
                  <button
                    className="text-xl bg-green-500 p-1 border rounded-lg border-black"
                    onClick={handleSubmitCreate}
                  >
                    Create
                  </button>
                  <button
                    className="text-xl bg-red-500 p-1 border rounded-lg border-black"
                    onClick={cancelAllCreate}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Popup>
        {/* Update Popup */}
        <Popup open={openUpdate} closeOnDocumentClick onClose={closeModal}>
          <div className="modal">
            <button className="close" onClick={closeModal}>
              &times;
            </button>
            <div className="header font-bold text-3xl"> Update Course!!!</div>
            <div className="content">
              {updated && (
                <div className="w-full text-green-500 font-semibold text-xl">
                  Updating successfully!!!
                </div>
              )}
              <form className="w-full flex justify-center flex-col gap-5 items-center min-h-[10rem]">
                <div className="flex flex-row w-full items-center justify-center">
                  <span className="text-xl font-medium w-[30%]">
                    Course's Name:
                  </span>
                  <input
                    className={`border ${
                      errors.name
                        ? "border-red-500 border-2"
                        : "border-gray-900"
                    }  rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
                    onChange={handleInputChange}
                    type="text"
                    value={formData.name}
                    name="name"
                  ></input>
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xl ">{errors.name}</p>
                )}
                <div className="flex flex-row w-full items-center justify-center">
                  <span className="text-xl font-medium w-[30%]">
                    Course's Subject
                  </span>
                  <input
                    className={`border  ${
                      errors.subjectCode
                        ? "border-red-500 border-2"
                        : "border-gray-900"
                    }  rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
                    onChange={handleInputChange}
                    type="text"
                    value={formData.subjectCode}
                    name="subjectCode"
                  ></input>
                </div>
                {errors.subjectCode && (
                  <p className="text-red-500 text-xl ">{errors.subjectCode}</p>
                )}
                <div className="flex flex-row gap-20 ">
                  <button
                    className="text-xl bg-green-500 p-1 border rounded-lg border-black"
                    onClick={handleSubmitUpdate}
                  >
                    Update
                  </button>
                  <button
                    className="text-xl bg-red-500 p-1 border rounded-lg border-black"
                    onClick={cancelAllUpdate}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Popup>
      </div>
    </div>
  );
}
