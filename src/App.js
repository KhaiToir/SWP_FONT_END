import { Navigate, Route, Routes } from "react-router-dom";
import { Student, Login, Admin, Lecturer } from "./pages";
import { CreateSlotLecturer } from "./components/lecturer";
import { auth, db } from "./config/firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { SET_USER } from "./context/actions/userActions";
import "../node_modules/@syncfusion/ej2-base/styles/material.css";
import "../node_modules/@syncfusion/ej2-buttons/styles/material.css";
import "../node_modules/@syncfusion/ej2-calendars/styles/material.css";
import "../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
import "../node_modules/@syncfusion/ej2-inputs/styles/material.css";
import "../node_modules/@syncfusion/ej2-lists/styles/material.css";
import "../node_modules/@syncfusion/ej2-navigations/styles/material.css";
import "../node_modules/@syncfusion/ej2-popups/styles/material.css";
import "../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
import "../node_modules/@syncfusion/ej2-react-schedule/styles/material.css";



function App() {
  const user = useSelector((state) => state.user?.user);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem("user");
    if (userFromLocalStorage) {
      const userCred = JSON.parse(userFromLocalStorage);
      dispatch(SET_USER(userCred));
      setIsLoading(false);
    } else {
      const unsubscribe = auth.onAuthStateChanged((userCred) => {
        if (userCred) {
          const userData = {
            ...userCred.providerData[0],
            role: "Student",
          };

          setDoc(doc(db, "user", userCred?.uid), userData).then(() => {
            // Dispatch the action to store
            dispatch(SET_USER(userData));
            setIsLoading(false);
            localStorage.setItem("user", JSON.stringify(userData));
          });
        } else {
          setIsLoading(false);
        }
      });

      // Clean up the listener event
      return () => unsubscribe();
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="w-screen h-screen flex items-center justify-center overflow-hidden">
          Loading....
        </div>
      ) : (
        <div className="bg-white h-full">
          <Routes>
            {!user ? (
              <>
                <Route path="/login/*" element={<Login />} />
                <Route path="*" element={<Navigate to={"/login"} />} />
              </>
            ) : (
              <>
                {user?.role === "Student" && (
                  <>
                    <Route path="/Student/*" element={<Student />} />
                    <Route path="*" element={<Navigate to="/Student" />} />
                  </>
                )}
                {user?.role === "Admin" && (
                  <>
                    <Route path="/Admin/*" element={<Admin />} />
                    <Route path="*" element={<Navigate to="/Admin" />} />
                  </>
                )}
                {user?.role === "Lecturer" && (
                  <>
                    <Route path="/Lecturer/*" element={<Lecturer />} />
                    <Route path="*" element={<Navigate to="/Lecturer" />} />
                  </>
                )}
              </>
            )}
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;
