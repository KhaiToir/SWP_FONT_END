import { useEffect, useState } from "react";
import {
  getAllSlotByLecturerID,
  searchBookingById,
  searchStudentById,
  searchSubjectById,
  searchTeacherById,
} from "../../api";
import moment from "moment";
import { useSelector } from "react-redux";
import { BiSolidUser } from "react-icons/bi";

export default function ScheduleLecturer({ userId, chosePage }) {
  const [bookingRooms, setBookingRooms] = useState([]);
  const user = useSelector((state) => state.user?.user);
  const [subject, setSubject] = useState([]);
  const [showStudentTableLocation, setShowStudentTableLocation] = useState("");
  const [showStudent, setShowStudent] = useState([]);
  const [sortedBookingRooms, setSortedBookingRooms] = useState([]);
  const [subjectList, setSubjectList] = useState("");

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
  async function addInfor() {
    let result = [];
    const lecturerInfor = await searchTeacherById(parseInt(user?.id));
    lecturerInfor.subjectId.map(async (subject) => {
      const subjectInfor = await searchSubjectById(parseInt(subject));

      result.push(subjectInfor.subjectCode);
    });
    setSubject(result);
  }

  async function addObject() {
    setSortedBookingRooms([]); // Clear the slot array first
    const updatedRequestedList = await Promise.all(
      bookingRooms.map(async (infor) => {
        let resultSub = [];
        if (infor.subjectId.length > 0) {
          await Promise.all(
            infor.subjectId.map(async (subId) => {
              const subFinded = await searchSubjectById(parseInt(subId));
              resultSub.push(subFinded.subjectCode);
            })
          );
        }
        infor.subString = resultSub.join(", ");
        return infor; // Return the updated infor object
      })
    );
    setSortedBookingRooms(updatedRequestedList.sort(compareDateAndTime));
  }
  useEffect(() => {
    chosePage("");
    if (userId || refresh === true) fetchData();
    addInfor();
    console.log("booking room");
    console.log(bookingRooms);
    setRefresh(false);
  }, [userId, refresh]);
  useEffect(() => {
    if (bookingRooms.length > 0) addObject();
  }, [bookingRooms]);

  //sort
  const compareDateAndTime = (a, b) => {
    const dateA = moment(a.startDatetime);
    const dateB = moment(b.startDatetime);
    if (dateA.isBefore(dateB)) return -1;
    if (dateA.isAfter(dateB)) return 1;
    return 0;
  };
  const handleShowStudent = async (infor) => {
    setShowStudent([]);
    setShowStudentTableLocation(parseInt(infor.id));
    let result = [];
    console.log("infor", infor);
    infor.bookingId.map(async (bookId) => {
      console.log("bookId", bookId);
      const bookedInfor = await searchBookingById(parseInt(bookId));
      console.log("bookedInfor", bookedInfor);
      const accountInfor = await searchStudentById(
        parseInt(bookedInfor.studentId)
      ).then((data) => setShowStudent((prev) => [...prev, data]));
    });
  };
  //này là đã sorted
  // const sortedBookingRooms = [...bookingRooms].sort(compareDateAndTime);

  console.log(sortedBookingRooms);
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5 py-5">
      <div className="w-[90%] mx-auto flex flex-col gap-10 py-10 pb-20">
        <div>
          <span className="font-bold text-3xl underline">Schedule</span>
        </div>
        <div className="flex flex-row gap-5">
          <div className="font-semibold">Main Subject:</div>{" "}
          {subject && subject.map((sub) => <span>{sub}</span>)}
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
                <th className="text-xl font-medium border-b-2 border-black border-r-2">
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
                  <tr className="relative" key={index}>
                    <td className="text-center px-16 text-lg p-2 border-black border-r-2">
                      {index + 1}
                    </td>
                    <td className="text-center px-16 text-lg p-2 border-black border-r-2">
                      {info.location}
                    </td>
                    <td className="text-center px-16 text-lg p-2 border-black border-r-2">
                      {info?.subString}
                    </td>
                    <td className="text-center px-16 text-lg p-2 border-black  border-r-2">
                      {moment(info.startDatetime).format("DD/MM/YYYY") +
                        " , " +
                        moment(info.startDatetime).format("HH:mm") +
                        "-" +
                        moment(info.endDatetime).format("HH:mm")}
                    </td>
                    <td className="px-16 text-lg p-2 border-black flex items-center">
                      {info.bookingId?.length + "/" + info.limitBooking}
                      <button onClick={() => handleShowStudent(info)}>
                        <BiSolidUser />
                      </button>
                    </td>
                    {showStudentTableLocation === info.id && (
                      <div className="absolute flex flex-col bg-white rounded-md border-orange-500 border-2 p-5 z-[99] left-[70%]">
                        <span className="text-center font-bold pb-3 mt-[-1rem]">
                          Student participated
                        </span>
                        <button
                          className="absolute right-3 top-0 text-2xl"
                          onClick={() => {
                            setShowStudentTableLocation("");
                            setShowStudent([]);
                          }}
                        >
                          &times;
                        </button>
                        <table>
                          <thead>
                            <tr>
                              <th className="border-b-2 border-black border-r-2 px-5">
                                No.
                              </th>
                              <th className="border-b-2 border-black px-10">
                                FullName
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {showStudent &&
                              showStudent.map((stu, index) => (
                                <tr>
                                  <td className="px-5 border-black border-r-2">
                                    {index + 1}
                                  </td>
                                  <td className="px-5 border-black whitespace-nowrap">
                                    {stu.fullname}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
