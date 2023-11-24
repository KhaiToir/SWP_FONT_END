import { Link, useParams } from "react-router-dom";
import { TbArrowBigLeftFilled } from "react-icons/tb";
import { ShowBoxs } from "./index";
import { useEffect, useState } from "react";
import {
  getAllBookingByLecturerIDORStudentID,
  getAllSlotByLecturerID,
  searchSubjectById,
  searchTeacherById,
} from "../../api";
import { DateRangePickerComponent } from "@syncfusion/ej2-react-calendars";

export default function Booking({ userId }) {
  const { lecturerId } = useParams();
  const [bookingRooms, setBookingRooms] = useState([]);
  const [showList, setShowList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedDate, setSelectedDate] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllSlotByLecturerID(parseInt(lecturerId));
        const filteredData = data.filter(
          (slot) =>
            slot.mode !== "Private" &&
            slot.status !== "Unactive" &&
            slot.status !== "Finish"
        );
        const sortedData = filteredData.sort((a, b) => {
          const startDateA = new Date(a.startDatetime);
          const startDateB = new Date(b.startDatetime);
          return startDateA - startDateB;
        });
        setBookingRooms(sortedData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    setRefresh(false);
  }, [lecturerId, refresh]);

  const addObject = async () => {
    const updatedRequestedList = await Promise.all(
      bookingRooms.map(async (infor) => {
        const lecturerInfor = await searchTeacherById(infor.lecturerId);
        const bookInfor = await getAllBookingByLecturerIDORStudentID(
          infor.lecturerId
        );
        const check = bookInfor.find(
          (booked) => booked.slotId === infor.id && booked.studentId === userId
        );
        let subjectRequired = await Promise.all(
          lecturerInfor.subjectId.map(async (sub) => {
            const result = await searchSubjectById(parseInt(sub));
            return result;
          })
        );

        infor.subjectRequired = subjectRequired;

        if (check) infor.status = "Booked";

        infor.lecturerInfor = lecturerInfor;

        return infor;
      })
    );

    handleDateChange(updatedRequestedList);
  };
  useEffect(() => {
    if (bookingRooms.length > 0) addObject();
  }, [bookingRooms, userId]);

  const handleDateChange = (args) => {
    let selectedDateRange = Array.isArray(args) ? args : args.value;

    if (
      selectedDate.length === 2 &&
      (selectedDateRange === selectedDate ||
        (selectedDateRange && selectedDateRange.length !== 2))
    ) {
      selectedDateRange = selectedDate;
    }
    console.log(selectedDateRange);
    if (!selectedDateRange || selectedDateRange.length !== 2) {
      console.log("null ne");
      const today = new Date();
      const startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0
      );

      const filteredList = bookingRooms.filter((item) => {
        const slotStartDate = new Date(item.startDatetime);
        return startDate <= slotStartDate;
      });

      setShowList(filteredList);
    } else {
      console.log(selectedDateRange);
      setSelectedDate(selectedDateRange);

      const filteredList = bookingRooms.filter((item) => {
        const startDate = new Date(item.startDatetime);
        return (
          startDate >= new Date(selectedDateRange[0]) &&
          startDate <= new Date(selectedDateRange[1].setHours(23, 59, 59, 999))
        );
      });

      setShowList(filteredList);
    }
  };

  return (
    <div className="w-full bg-white flex flex-col justify-center items-start gap-5">
      <Link
        className="h-[10%] font-bold flex flex-row gap-5 items-center"
        to={`/student`}
      >
        <span className="text-4xl">
          <TbArrowBigLeftFilled />
        </span>{" "}
        <span className="text-2xl underline">Home</span>
      </Link>
      <div className="w-[90%] mx-[5%] h-full bg-white">
        <div className="flex flex-row">
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
        />
      </div>
    </div>
  );
}
