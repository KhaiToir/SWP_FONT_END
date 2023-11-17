import { Header } from "../layout";
import { Body, Booking, Feedback } from "../components/student";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllNotification } from "../api";
import { useEffect, useState } from "react";

function Student() {
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
        <Route path="Feedback/:infor" element={<Feedback userId={userId} />} />
        <Route
          path="Booking/:lecturerId"
          element={<Booking userId={userId} />}
        />
      </Routes>
    </div>
  );
}

export default Student;
