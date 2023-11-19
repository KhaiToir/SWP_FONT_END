import {  Header } from "../layout";
import {  Route, Routes } from "react-router-dom";
import {
  CreateRequestSlot,
  CreateSlotLecturer,
  UpdateSlotLecturer,
} from "../components/lecturer";
import Body from "../components/lecturer/Body";
import { useSelector } from "react-redux";

export default function Lecturer() {
  const user = useSelector((state) => state.user?.user);
  const userId = user?.id;
  console.log(userId);


  return (
    <div className="bg-white h-full">
      <Header />
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
