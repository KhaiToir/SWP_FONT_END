import {
  searchStudentById,
  searchSubjectById,
  searchSlotById,
  getAllBookingByLecturerIDORStudentID,
  searchTeacherById,
} from "../../api";
import { Requested, ShowBoxs } from "./index";
import { useEffect, useState } from "react";


export default function Pending({userId}) {
  const [bookedList, setBookedList] = useState([]);
  const [showList, setShowList] = useState([]);
  const [slotArray,setSlotArray]=useState([]);
  const [route, setRoute] = useState("Booked");
  const [refresh, setRefresh] = useState(false);

  async function fetchData(studentId) {
    const response = await getAllBookingByLecturerIDORStudentID(
      parseInt(studentId)
    )
      .then((data) =>
        setBookedList(data.filter(booked=>booked.studentId===parseInt(studentId)&&booked.status!=="Denied"))
      )
      .catch((error) => console.log(error));
  }
  async function addObject() {
    const updatedRequestedList = await Promise.all(
      bookedList.map(async (infor) => {
        const lecturerInfor = await searchTeacherById(infor.lecturerId);
        const subjectInfor = await searchSubjectById(infor.subjectId);
        const slotInfor = await searchSlotById(infor.slotId);
        // Update the infor object with the response object in the studentId property
        infor.lecturerInfor = lecturerInfor;
        // Update the infor object with the response object in the subjectId property
        infor.subjectInfor = subjectInfor;
        // Update the infor object with the response object in the slotId property
        infor.slotInfor = slotInfor;
        return infor; // Return the updated infor object
      })
    );
    // Updated array\
    const slots= updatedRequestedList.map(item => ({...item.slotInfor,bookedId:item.id,lecturerInfor:item.lecturerInfor}));
    setShowList(updatedRequestedList);
    setSlotArray(slots)
  }
  useEffect(() => {
    if (refresh===true||userId) {
      fetchData(userId);
      console.log(bookedList);
      setRefresh(false)
    }
  }, [refresh,userId]);
  useEffect(() => {
    addObject();
    console.log(showList);
  }, [bookedList]);
  console.log('booking');
  console.log(bookedList);
  console.log(showList);
  console.log('slot');
  console.log(slotArray);
  return (
    <div className="w-full h-ull flex flex-col justify-center items-start gap-5">
      <div className="w-full">
        <button
          onClick={() => setRoute("Booked")}
          className={` w-40 h-14 ${
            route === "Booked" ? "bg-orange-300" : "bg-gray-300"
          }`}
        >
          Booked
        </button>
        <button
          onClick={() => setRoute("Requested")}
          className={` w-40 h-14 ${
            route === "Requested" ? "bg-orange-300" : "bg-gray-300"
          }`}
        >
          Requested
        </button>
      </div>
      <div className="w-[90%] flex justify-center pl-[5%]">
        {route === "Booked" ? (
          <ShowBoxs  userId={userId} childArray={slotArray.filter(slot=>slot.status==="Not Book" && !slot.bookingId.includes(slot.bookedId))} type='Pending' setRefresh={setRefresh}></ShowBoxs>
        ) : (
          <Requested userId={userId}></Requested>
        )}
      </div>
    </div>
  );
}
