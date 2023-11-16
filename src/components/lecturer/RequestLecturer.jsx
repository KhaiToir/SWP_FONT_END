import { useEffect, useState } from "react";
import {
  deleteRequestById,
  getAllRequestByLecturerORStudentID,
  searchStudentById,
  searchSubjectById,
} from "../../api";

import Popup from "reactjs-popup";
import { Link } from "react-router-dom";

export default function RequestLecturer({ userId,chosePage }) {
  const [requestedList, setRequestedList] = useState([]);
  const [showList, setShowList] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteHolder, setDeleteHolder] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [addObjectStatus, setAddObjectStatus] = useState(false);
  const closeModal = () => {
    setOpenDelete(false);
    setDeleteHolder(0);
  };
  async function handleDeleteYes() {
    try {
      const response = await deleteRequestById(parseInt(deleteHolder));
      setRefresh(true);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  }
  function handleDelete(id) {
    setOpenDelete((open) => !open);
    setDeleteHolder(id);
  }

  async function fetchData() {
    const response = await getAllRequestByLecturerORStudentID(parseInt(userId))
      .then((data) => setRequestedList(data.filter(request=>request.status==="Pending")))
      .catch((error) => console.log(error));
  }
  async function addObject() {
    if (requestedList) {
      const updatedRequestedList = await Promise.all(
        requestedList.map(async (infor) => {
          const response1 = await searchStudentById(infor.studentId);
          // Update the infor object with the response object in the studentId property
          infor.studentInfor = response1;
          // Update the infor object with the response object in the subjectId property
          const response2 = await searchSubjectById(infor.subjectId);
          infor.subjectInfor = response2;
          return infor; // Return the updated infor object
        })
      );
      // Updated array
      setShowList(updatedRequestedList.sort((a,b)=>{
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        // Compare dateB with dateA to sort from newest to oldest
        return dateB - dateA;
      }));
    }
  }

  useEffect(() => {
    chosePage('Request');
    const fetchDataAndAddObject = async () => {
      if (userId || refresh === true) {
        await fetchData();
        setRefresh(false);
        setAddObjectStatus(true);
      }
    };

    fetchDataAndAddObject();
  }, [userId, refresh]);

  useEffect(() => {
    if (addObjectStatus === true) {
      addObject();
      setAddObjectStatus(false);
    }
  }, [addObjectStatus]);
  console.log(requestedList);
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5 py-5">
      <div className="w-[90%] mx-auto flex flex-col gap-10 py-10 pb-20">
        <div>
          <span className="font-bold text-3xl underline pl-20">Request</span>
        </div>
        <div className="w-full flex flex-col gap-10">
          {showList &&
            showList.map((infor, index) => (
              <div
                key={index}
                className="w-full h-fit flex flex-row  p-5 border-gray-400 border-2 rounded-md min-h-[25%] justify-between gap-10"
              >
                <div className="flex flex-col gap-5">
                  <div className="w-full flex flex-row gap-5">
                    <div className="text-lg">
                      {infor.studentInfor?.fullname}
                    </div>
                    <div className="text-lg">{infor.studentInfor?.email}</div>
                    <div className="text-lg">
                      Course: {infor.subjectInfor?.subjectCode}
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="text-lg">
                      Description: {infor.description}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link to={`/Lecturer/Home/${infor.id}`}>
                    <button className="text-white bg-green-500 px-3 py-2 rounded-3xl">
                      Accept
                    </button>
                  </Link>
                  <button
                    className="text-white bg-red-500 px-3 py-2 rounded-3xl"
                    onClick={() => handleDelete(infor.id)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* Delete Popup */}
      <Popup open={openDelete} closeOnDocumentClick onClose={closeModal}>
        <div className="modal">
          <button className="close" onClick={closeModal}>
            &times;
          </button>
          <div className="header font-bold text-xl">
            {" "}
            Are you sure want to deny this request!!!
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
