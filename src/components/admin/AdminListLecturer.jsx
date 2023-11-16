import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import moment from "moment";
import "../../cssstyles/popupStyles.css";
import { getAllUser, deleteAccountById } from "../../api";
import AdminUpdateAccount from "./AdminUpdateAccount";

export default function AdminListLecturer({ lecturers, setRefresh ,chosePage}) {
  const [lecturerList, setLecturerList] = useState([]);
  const [showList, setShowList] = useState([]);
  const [searchComponent, setSearchComponent] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteHolder, setDeleteHolder] = useState("");
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updateObject, setUpdateObject] = useState();
 
  const closeModal = () => {
    setOpen(false);
    setOpenUpdate(false);
  };

  useEffect(() => {
    chosePage('Lecturer')
    setLecturerList(lecturers);
    setShowList(lecturers);
    console.log(lecturerList);
  }, [lecturers]);

  function searchHandleClick(e) {
    e.preventDefault();
    setShowList(
      lecturerList.filter(
        (obj) =>
          obj.fullname.toLowerCase().includes(searchComponent.toLowerCase()) ||
          obj.email.toLowerCase().includes(searchComponent.toLowerCase())
      )
    );
  }
  function handleDelete(lecturerId) {
    setOpen((open) => !open);
    setDeleteHolder(lecturerId);
  }
  function handleUpdate(lecturer) {
    setOpenUpdate((open) => !open);
    setUpdateObject(lecturer);
  }
  async function handleDeleteYes() {
    if (deleteHolder) {
      try {
        console.log(deleteHolder);
        await deleteAccountById(deleteHolder);
        // If the deletion is successful, you can update the local state.
        setDeleteHolder(0);
        setOpen(false);
        setRefresh(true);
      } catch (error) {
        // Handle the error
        console.error("Error deleting account:", error);
      }
    }
  }

  return (
    <div className="w-full max-w-full h-full flex flex-col justify-center items-center gap-5 py-5">
      <div className="w-[90%] mx-auto flex flex-col gap-10 py-10 pb-20">
        <div>
          <span className="font-bold text-3xl underline">
            List of Lecturers: {showList && showList.length}
          </span>
        </div>
        <div className="">
          <form className="flex flex-row gap-10 px-10">
            <input
              value={searchComponent}
              onChange={(e) => setSearchComponent(e.target.value)}
              placeholder="Search by name or email"
              className="bg-gray-100 placeholder:text-gray-400 rounded-3xl placeholder:font-semibold w-[40%] text-center p-2"
            ></input>
            <button
              className="bg-orange-400 text-white rounded-3xl w-fit px-5"
              onClick={(e) => searchHandleClick(e)}
            >
              Search
            </button>
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
                Date of Birth
              </th>
              <th className="text-xl p-3 font-semibold bg-gray-300 border-black border-r-2">
                Username
              </th>
              <th className="text-xl p-3 font-semibold bg-gray-300 border-black border-r-2">
                Password
              </th>
              <th className="text-xl p-3 font-semibold bg-gray-300 border-black ">
                Email
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
                    {info.fullname}
                  </td>
                  <td className="text-center font-medium text-lg p-2 border-black border-r-2">
                    {moment(info.dob).format("DD/MM/YYYY")}
                  </td>
                  <td className="text-center font-medium text-lg p-2 border-black border-r-2">
                    {info.username}
                  </td>
                  <td className="text-center font-medium text-lg p-2 border-black border-r-2">
                    {info.password}
                  </td>
                  <td className="text-center font-medium text-lg p-2 border-black border-r-2">
                    {info.email}
                  </td>
                  <td className="text-center font-medium text-lg p-2 border-black border-r-2">
                    <button className="  text-gray-500" onClick={() => handleUpdate(info)}>Update</button>
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
        {/* Delete popup */}
        <Popup open={open} closeOnDocumentClick onClose={closeModal}>
          <div className="modal">
            <button className="close" onClick={closeModal}>
              &times;
            </button>
            <div className="header font-bold text-xl">
              {" "}
              Are you sure want to delete this user!!!
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
        {/* Update Popup */}
        <Popup open={openUpdate} closeOnDocumentClick onClose={closeModal}>
          <div className="modal">
            <button className="close" onClick={closeModal}>
              &times;
            </button>
            <div className="flex flex-col items-center h-auto w-auto">
            <AdminUpdateAccount updateObject={updateObject} setRefresh={setRefresh}/>
            </div>
          </div>
        </Popup>
      </div>
    </div>
  );
}
