import { useState } from "react";
import {
  Search,
  Schedule,
  Request,
  Pending,
  History,
  Feedback,
  Booking,
} from "./index";
import { Link, Route, Routes } from "react-router-dom";
export default function Body({userId}) {
  const [page, chosePage] = useState("Home");
  return (
    <div className="min-h-[90%] flex flex-col bg-white">
      <div className="flex flex-row h-[10%]">
        <Link to="*">
          <button
            className={` w-40 h-14 ${
              page === "Home" ? "bg-orange-300" : "bg-gray-300"
            }`}
            onClick={() => chosePage("Home")}
          >
            Home
          </button>
        </Link>
        <Link to="Pending">
          <button
            className={` w-40 h-14 ${
              page === "Pending" ? "bg-orange-300" : "bg-gray-300"
            }`}
            onClick={() => chosePage("Pending")}
          >
            Pending
          </button>
        </Link>
        <Link to="Request">
          <button
            className={` w-40 h-14 ${
              page === "Request" ? "bg-orange-300" : "bg-gray-300"
            }`}
            onClick={() => chosePage("Request")}
          >
            Request
          </button>
        </Link>
        <Link to="History">
          <button
            className={` w-40 h-14 ${
              page === "History" ? "bg-orange-300" : "bg-gray-300"
            }`}
            onClick={() => chosePage("History")}
          >
            History
          </button>
        </Link>
      </div>
      <div className="h-[90%]">
        <Routes>
          <Route path="*" element={<Search chosePage={chosePage}/>} />
          <Route path="Pending" element={<Pending userId={userId} chosePage={chosePage} />} />
          <Route path="Request" element={<Request userId={userId} chosePage={chosePage} />} />
          <Route path="History" element={<History userId={userId} chosePage={chosePage} />} />
          <Route path="Schedule" element={<Schedule userId={userId} chosePage={chosePage} />} />
        </Routes>
        {/*,
  ScheduleLecturer, */}
      </div>
    </div>
  );
}
