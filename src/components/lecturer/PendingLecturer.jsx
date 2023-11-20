import { useEffect, useState } from "react";
import { TiTick, TiTimes } from "react-icons/ti";
import {
  searchStudentById,
  searchSubjectById,
  searchSlotById,
  getAllBookingByLecturerIDORStudentID,
  updateBookingById,
} from "../../api";
import moment from "moment";
import Popup from "reactjs-popup";

export default function PendingLecturer({ userId, chosePage }) {
  const [bookedList, setBookedList] = useState([]);
  const [showList, setShowList] = useState([]);
  const [formData, setFormData] = useState({});
  const [formId, setFormId] = useState(0);
  const [popup, setPopup] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [deny, setDeny] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState("");

  const closeModal = () => {
    setPopup(false);
    setFormData({});
    setFormId(0);
  };
  const closeModalDeny = () => {
    setDeny("");
    setReason("");
    setErrors("");
  };

  async function fetchData() {
    const response = await getAllBookingByLecturerIDORStudentID(
      parseInt(userId)
    )
      .then((data) =>
        setBookedList(data.filter((data) => data.status === "Pending"))
      )
      .catch((error) => console.log(error));
  }

  async function makePutData(form, id) {
    try {
      const response = await updateBookingById(form, id);
      setRefresh(true);
    } catch {}
  }

  async function handleAccpet(id) {
    const data = bookedList.find((book) => book.id === id);
    setFormData({
      studentId: parseInt(data.studentId),
      slotId: parseInt(data.slotId),
      subjectId: parseInt(data.subjectId),
      description: data.description,
      reason: data.reason === null ? "" : data.reason,
      status: "Success",
    });
    setFormId(data.id);
    setPopup(true);
    console.log(data.id);
  }

  async function handleDeny(id) {
    const data = bookedList.find((book) => book.id === id);
    setFormData({
      studentId: parseInt(data.studentId),
      slotId: parseInt(data.slotId),
      subjectId: parseInt(data.subjectId),
      description: data.description,
      reason: data.reason === null ? "" : data.reason,
      status: "Denied",
    });
    console.log("data", data);
    setFormId(data.id);
    setDeny(id);
    console.log(data.id);
  }

  async function submitAccept() {
    console.log(formData);
    await makePutData(formData, formId);
    setPopup(false);
    setRefresh(true);
  }

  async function submitDeny(e) {
    e.preventDefault();
    //e này là để dùng ngăn chặn các event khác làm refresh lại trang.

    if (reason !== "") {
      console.log({...formData,reason:reason});
      await makePutData({...formData,reason:reason}, formId);
      setDeny("");
      setRefresh(true);
      setFormId("");
    } else setErrors("You need a reason to deny.");
  }

  async function addObject() {
    const updatedRequestedList = await Promise.all(
      bookedList.map(async (infor) => {
        const studentInfor = await searchStudentById(infor.studentId);
        const subjectInfor = await searchSubjectById(infor.subjectId);
        const slotInfor = await searchSlotById(infor.slotId);
        // Update the infor object with the response object in the studentId property
        infor.studentInfor = studentInfor;
        // Update the infor object with the response object in the subjectId property
        infor.subjectInfor = subjectInfor;
        // Update the infor object with the response object in the slotId property
        infor.slotInfor = slotInfor;
        return infor; // Return the updated infor object
      })
    );
    // Updated array\
    setShowList(updatedRequestedList);
  }
  useEffect(() => {
    chosePage("Pending");
    if (userId || refresh === true) {
      fetchData();
      console.log(bookedList);
      setRefresh(false);
    }
  }, [userId, refresh]);
  useEffect(() => {
    addObject();
    console.log(showList);
  }, [bookedList]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5 py-5">
      <div className="w-[90%] mx-auto flex flex-col gap-10 py-10 pb-20">
        <div>
          <span className="font-bold text-3xl underline">Pending</span>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-xl p-3 font-semibold bg-gray-200 border-black border-b-2 border-t-2 border-l-2">
                Name
              </th>
              <th className="text-xl p-3 font-semibold bg-gray-200 border-black border-b-2 border-t-2">
                Course
              </th>
              <th className="text-xl p-3 font-semibold bg-gray-200 border-black border-b-2 border-t-2">
                Location
              </th>
              <th className="text-xl p-3 font-semibold bg-gray-200 border-black border-b-2 border-t-2">
                Time
              </th>
              <th className="text-xl p-3 font-semibold bg-gray-200 border-black border-b-2 border-t-2">
                Date
              </th>
              <th className="text-xl p-3 font-semibold bg-gray-200 border-black border-b-2 border-t-2  ">
                Description
              </th>
              <th className="text-xl p-3 font-semibold bg-gray-200 border-black border-b-2 border-t-2">
                Accept
              </th>
              <th className="text-xl p-3 font-semibold bg-gray-200 border-black border-b-2 border-t-2 border-r-2 ">
                Decline
              </th>
            </tr>
          </thead>
          <tbody>
            {showList &&
              showList.map((info, index) => (
                <tr className="bg-gray-100">
                  <td className="text-center font-medium text-lg p-2 border-black border-b-2 border-l-2 ">
                    {info.studentInfor?.fullname}
                  </td>
                  <td className="text-center font-medium text-lg p-2 border-black border-b-2">
                    {info.subjectInfor?.subjectCode}
                  </td>
                  <td className="text-center font-medium text-lg p-2 border-black border-b-2">
                    {info.slotInfor?.location}
                  </td>
                  <td className="text-center font-medium text-lg p-2 border-black border-b-2">
                    {moment(info.slotInfor?.startDatetime).format("HH:mm")}-
                    {moment(info.slotInfor?.endDatetime).format("HH:mm")}
                  </td>
                  <td className="text-center font-medium text-lg p-2 border-black border-b-2">
                    {moment(info.slotInfor?.startDatetime).format("DD/MM/YY")}
                  </td>
                  <td className="text-center font-medium text-lg p-2 border-black border-b-2 max-w-[15rem]  min-w-[15rem]">
                    {info.description}
                  </td>
                  <td className="text-center font-medium text-4xl p-2 border-black border-b-2">
                    <button
                      className=" text-white bg-green-400 rounded-full"
                      onClick={() => handleAccpet(info.id)}
                    >
                      <TiTick />
                    </button>
                  </td>
                  <td className="text-center font-medium text-4xl  p-2 border-black  border-r-2 border-b-2 relative">
                    <button
                      className=" text-white bg-red-400 rounded-full"
                      onClick={() => handleDeny(info.id)}
                    >
                      <TiTimes />
                    </button>
                  </td>
                  {parseInt(deny) === info.id && (
                    <div
                      className={`flex flex-col items-end absolute w-fit border-2 right-[7rem] min-h-[5rem] border-black bg-white z-50 opacity-80 px-5 py-1 pb-5`}
                    >
                      <button
                        className="text-2xl w-fit"
                        onClick={closeModalDeny}
                      >
                        &times;
                      </button>
                      <form className="flex flex-col gap-3 justify-end items-end relative w-full">
                        <div className="flex flex-row justify-between items-center w-full">
                          <span>Reason:</span>
                          <input
                            onChange={(e) => {
                              console.log("dienform", e.target.value);
                              setReason(e.target.value);
                            }}
                            className={`border-2 w-[11rem] ${
                              errors !== ""
                                ? "border-red-500 "
                                : "border-gray-900"
                            } `}
                            value={reason}
                          />
                        </div>
                        {errors !== "" && (
                          <div className="text-red-500 text-sm">{errors}</div>
                        )}
                        <button
                          className=" border border-black px-2 bg-cyan-400 text-white"
                          onClick={submitDeny}
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* Popup up */}
      <Popup open={popup} closeOnDocumentClick onClose={closeModal}>
        <div className="modal">
          <button className="close" onClick={closeModal}>
            &times;
          </button>
          <div className="header font-bold text-xl">
            {" "}
            Are you sure want to accept this booking!!!
          </div>
          <div className="flex flex-row justify-center items-center h-[5rem] gap-20">
            <button
              className="w-[25%] text-base border rounded-xl p-2 border-black font-medium bg-green-500"
              onClick={submitAccept}
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