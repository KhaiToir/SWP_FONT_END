import { Footer, Header } from "../layout";
import { Link, Route, Routes } from "react-router-dom";
import {
  CreateRequestSlot,
  CreateSlotLecturer,
  UpdateSlotLecturer,
} from "../components/lecturer";
import Body from "../components/lecturer/Body";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllNotification } from "../api";

export default function Lecturer() {
  const [notifications, setNotifications] = useState([]);
  const user = useSelector((state) => state.user?.user);
  const userId = user?.id;
  console.log(userId);

  async function fetchData() {
    const response = await getAllNotification()
      .then((data) =>
        setNotifications(
          data.filter(
            (noti) =>
              noti?.sendToId === user?.id && noti?.isRead === false
          )
        )
      )
      .catch((error) => console.log(error));
  }
  useEffect(() => {
    // Set up interval to fetch notifications every 5 seconds
    const intervalId = setInterval(fetchData, 3000);
    console.log(notifications);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-white h-full">
      <Header notifications={notifications} />
      <Routes>
        <Route path="*" element={<Body userId={userId} />} />
        <Route
          path="/create"
          element={<CreateSlotLecturer userId={userId} />}
        />
        <Route
          path="/update/:id"
          element={<UpdateSlotLecturer userId={userId} />}
        />
        <Route
          path="/CreateByRequest/:id"
          element={<CreateRequestSlot userId={userId} />}
        />
      </Routes>
    </div>
  );
}
