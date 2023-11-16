import { useEffect, useState } from "react";
import {
  getAllSlotByLecturerID,
  searchBookingById,
  searchSubjectById,
} from "../../api";
import moment from "moment";

export default function ScheduleLecturer({ userId, chosePage }) {
  const [bookingRooms, setBookingRooms] = useState([]);
  const [showList, setShowList] = useState([]);

  const [refresh, setRefresh] = useState(false);
  async function fetchData() {
    const response = await getAllSlotByLecturerID(parseInt(userId))
      .then((data) =>
        setBookingRooms(
          data.filter(
            (slot) => slot.status !== "Unactive" && slot.status !== "Finish"
          )
        )
      )
      .catch((error) => console.log(error));
  }
  async function addObject() {
    const updatedRequestedList = await Promise.all(
      bookingRooms.map(async (infor) => {
        let subjectCode=[];
        infor.subjectId.map(async(subject)=>{
          const subjectInfor = await searchSubjectById(parseInt(subject));
          subjectCode.push(subjectInfor.subjectCode);
        })
        infor.subjectCode=subjectCode;
        return infor; // Return the updated infor object
      })
    );
    // Updated array
    console.log('update');
    console.log(updatedRequestedList);
    setShowList(updatedRequestedList);
  }

  useEffect(() => {
    chosePage("");
    if (userId || refresh === true) fetchData();
    console.log("booking room");
    console.log(bookingRooms);
    setRefresh(false);
  }, [userId, refresh]);

  useEffect(() => {
    if (bookingRooms.length > 0) {
     addObject();
    }
  }, [bookingRooms]);

  //sort 
  const compareDateAndTime = (a, b) => {
    const dateA = moment(a.startDatetime);
    const dateB = moment(b.startDatetime);
    if (dateA.isBefore(dateB)) return -1;
    if (dateA.isAfter(dateB)) return 1;
    return 0;
  };

  //này là đã sorted
  const sortedBookingRooms = [...bookingRooms].sort(compareDateAndTime);
  
  console.log(sortedBookingRooms);
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
                  Location
                </th>
                <th className="text-xl font-medium border-b-2 border-black  border-r-2">
                  Course
                </th>
                <th className="text-xl font-medium border-b-2 border-black  border-r-2">
                  Time
                </th>
                <th className="text-xl font-medium border-b-2 border-black ">
                  Numbers
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedBookingRooms &&
                sortedBookingRooms.map((info, index) => (
                  <tr className="" key={index}>
                    <td className="text-center px-16 text-lg p-2 border-black border-r-2">
                      {index + 1}
                    </td>
                    <td className="text-center px-16 text-lg p-2 border-black border-r-2">
                      {info.location}
                    </td>
                    <td className="text-center px-16 text-lg p-2 border-black border-r-2">
                      {info?.subjectCode&& info.subjectCode.join(', ')}
                    </td>
                    <td className="text-center px-16 text-lg p-2 border-black  border-r-2">
                      {moment(info.startDatetime).format("DD/MM/YYYY") +
                        " , " +
                        moment(info.startDatetime).format("HH:mm") +
                        "-" +
                        moment(info.endDatetime).format("HH:mm")}
                    </td>
                    <td className="text-center px-16 text-lg p-2 border-black ">
                      {info.bookingId?.length + "/" + info.limitBooking}
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
