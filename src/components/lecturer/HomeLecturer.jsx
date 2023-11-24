import { ShowBoxs } from "./index";
import { useEffect, useState } from "react";
import {
  getAllSlotByLecturerID,
  searchRequestById,
  searchTeacherById,
} from "../../api";
import { useParams } from "react-router-dom";

export default function HomeLecturer({ userId,chosePage }) {
  const { requestId } = useParams();
  const [bookingRooms, setBookingRooms] = useState([]);
  const [showList, setShowList] = useState([]);
  const [requestInfor, setRequestInfor] = useState({});

  const [refresh, setRefresh] = useState(false);
  async function fetchData() {
    try {
      const data = await getAllSlotByLecturerID(parseInt(userId));
      const filteredData = data.filter(
        (slot) => slot.status !== "Unactive" && slot.status !== "Finish"
      );
  
      // Sort the filtered data by startDate in ascending order
      const sortedData = filteredData.sort((a, b) =>
        new Date(a.startDatetime) - new Date(b.startDatetime)
      );
  
      setBookingRooms(sortedData);
    } catch (error) {
      console.log(error);
    }
  }
  
  async function addObject() {
    const updatedRequestedList = await Promise.all(
      bookingRooms.map(async (infor) => {
        const lecturerInfor = await searchTeacherById(infor.lecturerId);
        // Update the infor object with the response object in the studentId property
        infor.lecturerInfor = lecturerInfor;
        // Update the infor object with the response object in the subjectId property
        // Update the infor object with the response object in the slotId property
        return infor; // Return the updated infor object
      })
    );
    // Updated array
    setShowList(updatedRequestedList);
  }

  async function searchRequest(id) {
    const response = await searchRequestById(parseInt(id))
      .then((data) => setRequestInfor(data))
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    if (userId || refresh === true) fetchData();
    console.log("booking room");
    console.log(bookingRooms);
    setRefresh(false);
  }, [userId, refresh]);

  useEffect(() => {
    if (bookingRooms.length > 0) {
      addObject();
      requestId&&searchRequest(requestId);
    }
    console.log(showList);
  }, [bookingRooms]);
  return (
    <div className="w-full h-full flex flex-col justify-center items-start gap-5">
      <div className="w-[90%] mx-[5%]">
        <ShowBoxs
          childArray={showList}
          setRefresh={setRefresh}
          requestInfor={requestInfor}
          setRequestInfor={setRequestInfor}
        ></ShowBoxs>
      </div>
    </div>
  );
}
