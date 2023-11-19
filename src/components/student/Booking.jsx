import { Link, useParams } from "react-router-dom";
import { TbArrowBigLeftFilled } from "react-icons/tb";
import { ShowBoxs } from "./index";
import { useEffect, useState } from "react";
import {
  getAllBookingByLecturerIDORStudentID,
  getAllSlotByLecturerID,
  searchBookingById,
  searchTeacherById,
} from "../../api";
import { DateRangePickerComponent } from "@syncfusion/ej2-react-calendars";
export default function Booking({ userId }) {
  const { lecturerId } = useParams();
  const [bookingRooms, setBookingRooms] = useState([]);
  const [showList, setShowList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  async function fetchData(id) {
    const response = await getAllSlotByLecturerID(parseInt(id))
      .then((data) =>
        setBookingRooms(
          data.filter(
            (slot) =>
              slot.mode !== "Private" &&
              slot.status !== "Unactive" &&
              slot.status !== "Finish"
          )
        )
      )
      .catch((error) => console.log(error));
  }
  async function addObject() {
    const updatedRequestedList = await Promise.all(
      bookingRooms.map(async (infor) => {
        const lecturerInfor = await searchTeacherById(infor.lecturerId);
        const bookInfor = await getAllBookingByLecturerIDORStudentID(
          infor.lecturerId
        );
        const check = bookInfor.filter(
          (booked) => booked.slotId === infor.id && booked.studentId === userId
        );
        if (Object.keys(check).length > 0) infor.status = "Booked";
        // Update the infor object with the response object in the studentId property
        infor.lecturerInfor = lecturerInfor;
        // Update the infor object with the response object in the subjectId property
        // Update the infor object with the response object in the slotId property
        return infor; // Return the updated infor object
      })
    );
    // Updated array
    handleDateChange(updatedRequestedList);
  }
  useEffect(() => {
    if (lecturerId || refresh === true) {
      fetchData(lecturerId);
      console.log("booking room");
      console.log(bookingRooms);
      setRefresh(false);
    }
  }, [lecturerId, refresh]);
  useEffect(() => {
    if (bookingRooms.length > 0) addObject();
    console.log(showList);
  }, [bookingRooms]);

  const handleDateChange = (args) => {
    // The selected date range is available in args.value
    
    // Check if args.value is empty
    if (!args.value || args.value.length !== 2) {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
      const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  
      // Filter the showList based on the default date range (today 00:00 to today 23:59)
      const filteredList = bookingRooms.filter((item) => {
        const slotStartDate = new Date(item.startDatetime);
        const slotEndDate = new Date(item.endDatetime);
        return startDate <= slotStartDate && slotEndDate <= endDate;
      });
  
      // Update the showList with the filtered list
      setShowList(filteredList);
    } else {
      // Filter the showList based on the selected date range
      const filteredList = bookingRooms.filter((item) => {
        const startDate = new Date(item.startDatetime);
        const endDate = new Date(item.endDatetime);
        return args.value[0] <= startDate && endDate <= args.value[1];
      });
  
      // Update the showList with the filtered list
      setShowList(filteredList);
    }
  };
  
  return (
    <div className="w-full bg-white flex flex-col justify-center items-start gap-5">
      <Link
        className="h-[10%]  font-bold flex flex-row gap-5 items-center"
        to={`/student`}
      >
        <span className="text-4xl">
          <TbArrowBigLeftFilled />
        </span>{" "}
        <span className="text-2xl underline">Home</span>
      </Link>
      <div className="w-[90%] mx-[5%] h-full bg-white">
        <div className=" flex flex-row ">
          <div>
            <DateRangePickerComponent
              change={handleDateChange}
              placeholder="Select a range"
            />
          </div>
        </div>
        <ShowBoxs
          childArray={showList}
          setRefresh={setRefresh}
          userId={userId}
        ></ShowBoxs>
      </div>
    </div>
  );
}
