import { useEffect, useState } from "react";
import {
  getAllBookingByLecturerIDORStudentID,
  getAllSlotByLecturerID,
  searchSlotById,
  searchStudentById,
  searchSubjectById,
  searchTeacherById,
} from "../../api";
import moment from "moment";

export default function Schedule({ userId, chosePage }) {
  const [bookedList, setBookedList] = useState([]);
  const [showList, setShowList] = useState([]);
  const [slotArray, setSlotArray] = useState([]);
  const [refresh, setRefresh] = useState(false);
  console.log(userId);

  async function fetchData(studentId) {
    const response = await getAllBookingByLecturerIDORStudentID(
      parseInt(studentId)
    )
      .then((data) =>
        setBookedList(
          data.filter(
            (booked) =>
              booked.studentId === parseInt(studentId) &&
              booked.status !== "Pending" &&
              booked.status !== "Denied"
          )
        )
      )
      .catch((error) => console.log(error));
  }
  async function addObject() {
    setSlotArray([]); // Clear the slot array first
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

    const result = updatedRequestedList.filter(
      (booked) =>
        (booked?.slotInfor?.bookingId.includes(booked.id) ||
          booked.status === "Denied") &&
        booked.slotInfor.status !== "Unactive" &&
        booked.slotInfor.status !== "Finish"
    );

    // Set the updatedRequestedList and slotArray after Promise.all is completed
    console.log("updated");
    console.log(updatedRequestedList);
    console.log("result");
    console.log(result);

    setShowList(updatedRequestedList);
    setSlotArray(
      result.sort((a, b) => {
        const dateA = moment(a.slotInfor.startDatetime);
        const dateB = moment(b.slotInfor.startDatetime);
        if (dateA.isBefore(dateB)) return -1;
        if (dateA.isAfter(dateB)) return 1;
        return 0;
      })
    );
  }
  useEffect(() => {
    chosePage("");
    if (refresh === true || userId) {
      fetchData(userId);
      console.log(bookedList);
      setRefresh(false);
      console.log("hello");
    }
  }, [refresh, userId]);

  useEffect(() => {
    // Call addObject() when bookedList changes
    addObject();
  }, [bookedList]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5 py-5">
      <div className="w-[90%] mx-auto flex flex-col gap-10 py-10 pb-20">
        <div>
          <span className="font-bold text-3xl underline">Schedule</span>
        </div>
        <div className="w-full flex justify-center items-center">
          <table className="w-fit">
            <thead>
              <tr>
                <th className="text-xl font-medium border-b-2 border-black border-r-2">
                  No.
                </th>
                <th className="text-xl font-medium border-b-2 border-black border-r-2">
                  Lecturer
                </th>
                <th className="text-xl font-medium border-b-2 border-black border-r-2">
                  Course
                </th>
                <th className="text-xl font-medium border-b-2 border-black border-r-2">
                  Location
                </th>
                <th className="text-xl font-medium border-b-2 border-black  border-r-2">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {slotArray &&
                slotArray.map((info, index) => (
                  <tr className="" key={index}>
                    <td className="text-center px-5 text-lg p-2 border-black border-r-2">
                      {index + 1}
                    </td>
                    <td className="text-center px-5 text-lg p-2 border-black border-r-2">
                      {info.lecturerInfor && info.lecturerInfor.fullname}
                    </td>
                    <td className="text-center px-5 text-lg p-2 border-black border-r-2">
                      {info.subjectInfor && info.subjectInfor.subjectCode}
                    </td>
                    <td className="text-center px-5 text-lg p-2 border-black border-r-2">
                      {info.slotInfor && info.slotInfor.location}
                    </td>
                    <td className="text-center px-5 text-lg p-2 border-black  border-r-2">
                      {moment(
                        info.slotInfor && info.slotInfor.startDatetime
                      ).format("DD/MM/YYYY") +
                        " , " +
                        moment(
                          info.slotInfor && info.slotInfor.startDatetime
                        ).format("HH:mm") +
                        "-" +
                        moment(
                          info.slotInfor && info.slotInfor.endDatetime
                        ).format("HH:mm")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
