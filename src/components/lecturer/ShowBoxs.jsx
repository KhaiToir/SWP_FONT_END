import { useEffect, useState } from "react";
import { LuPencilLine, LuTrash2, LuPlusCircle, LuLock } from "react-icons/lu";

import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import {
  createBooking,
  deleteRequestById,
  deleteSlotById,
  updateRequestById,
} from "../../api";
import Popup from "reactjs-popup";
export default function ShowBoxs({
  childArray,
  setRefresh,
  requestInfor,
  setRequestInfor,
}) {
  const [showInformations, setShowInformations] = useState(childArray);
  const [openDelete, setOpenDelete] = useState(false);
  const [clickSlot, setClickSlot] = useState(false);
  const [deleteHolder, setDeleteHolder] = useState("");
  const [slotHolder, setSlotHolder] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [error, setNewError] = useState({});

  const closeModal = () => {
    setOpenDelete(false);
    setDeleteHolder(0);
    setSlotHolder({});
    setClickSlot(false);
  };

  async function handleDeleteYes() {
    try {
      const response = await deleteSlotById(parseInt(deleteHolder));
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

  useEffect(() => {
    setShowInformations(childArray);
  }, [childArray]);

  console.log(showInformations);

  function handleClick(e, infor) {
    if (Object.keys(requestInfor).length > 0) {
      const key = e.target.value;
      console.log(key);
      if (infor.limitBooking === infor.bookingId.length) {
        setNewError({ id: infor.id, respone: "This slot is full" });
      } else {
        setClickSlot(true);
        setSlotHolder(infor);
      }
    }
  }

  async function handleChooseYes() {
    if (requestInfor) {
      console.log(slotHolder);
      console.log(requestInfor);
      console.log("create booking ne");
      try {
        const response = await createBooking({
          studentId: parseInt(requestInfor.studentId),
          slotId: parseInt(slotHolder.id),
          subjectId: parseInt(requestInfor.subjectId),
          description: requestInfor.description,
          status: "Success",
        });
        console.log("tra respone");
        console.log(response);
        if (response === "Booked succesfully!!!") {
          const respone2 = await updateRequestById(
            { ...requestInfor, status: "Success" },
            parseInt(requestInfor.id)
          );
        }
        setNewError({ id: parseInt(slotHolder.id), respone: response });
        setRefresh(true);
        closeModal();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }
  console.log("request ne");
  console.log(requestInfor);
  return (
    <div className="w-full pb-5 right-0 left-0 gap-[5%] flex flex-row flex-wrap h-full relative">
      <div className="w-full font-bold text-xl pt-5 ">
          CHOOSE SLOT TO ASSIGN.
        </div>
      {showInformations && showInformations.length === 0 && (
        <div className="w-full font-bold text-2xl pt-5 text-red-500">
          THERE ARE NO SLOT HERE.
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
                {infor?.lecturerInfor?.fullname}
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
            {error.id === infor.id && (
              <span
                className={`text-xl w-full text-center ${
                  error.respone === "Booked succesfully!!!"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {error.respone}
              </span>
            )}
            <div className="w-full flex flex-row justify-center relative items-center gap-5">
              {infor.Finish ? (
                <div className="absolute -left-4 bg-green-400 py-[0.3rem] px-[0.6rem] rounded-xl text-xs text-white">
                  Finished
                </div>
              ) : (
                <></>
              )}
              <Link to={`/Lecturer/Update/${infor.id}/${requestInfor.id}`}>
                <button className="text-3xl">
                  <LuPencilLine />
                </button>
              </Link>
              <button
                className={`text-white  p-3 w-[8rem] rounded-3xl font-bold
            ${
              infor.mode === "Private"
                ? "bg-red-500"
                : infor.mode === "Public"
                ? "bg-blue-400"
                : "bg-black"
            }`}
                value={infor.mode}
                onClick={(e) => handleClick(e, infor)}
              >
                {infor.mode && infor.mode === "Public" ? "Assign" : infor.mode}
              </button>
            </div>
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
      <Popup open={clickSlot} closeOnDocumentClick onClose={closeModal}>
        <div className="modal">
          <button className="close" onClick={closeModal}>
            &times;
          </button>
          <div className="header font-bold text-xl">
            {" "}
            Are you sure want to choose this slot!!!
          </div>
          <div className="flex flex-row justify-center items-center h-[5rem] gap-20">
            <button
              className="w-[25%] text-base border rounded-xl p-2 border-black font-medium bg-green-500"
              onClick={handleChooseYes}
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
