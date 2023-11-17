import { useEffect, useState } from "react";
import { Footer, Header } from "../layout";
import { FiUser, FiLock } from "react-icons/fi";
import { signInWithGoogle } from "../ultils/helpers";
import { buttonClick } from "../animations";
import { getLogin } from "../api";
import { SET_USER } from "../context/actions/userActions";
import { useDispatch } from "react-redux";

function Home() {
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [remember, isRemember] = useState(false);
  const [campus, choseCampus] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  async function loginSubmit(e) {
    e.preventDefault();
    console.log(userName);
    console.log(userPassword);
    if (userName === "" || userPassword === "") {
      setError("Please fill full information to login to the website.");
    } else {
      const result = await getLogin({
        email: userName,
        password: userPassword,
      });

      if (result) {
        dispatch(
          SET_USER({
            id: result.id,
            username: result.username,
            password: result.password,
            fullname: result.fullname,
            email: result.fullname,
            dob: result.dob,
            role: result.role,
            accessToken: result.accessToken,
            status: result.status,
          })
        );
      }
      if (result === undefined) {
        setError("Your password or email is wrong. Try again");
      } else {
       
      }
    }
  }
  return (
    <div className="bg-white h-full relative box-border">
      <div className="w-full bg-orange-400 flex h-[10%] items-center">
          <span className="pl-5 text-white text-xl">MEETLECTURER</span>
      </div>
      <div className="flex h-[80%] items-center justify-center ">
        <div className="flex items-center justify-center border-orange-400 border-4 rounded-md">
          <div className="m-8 flex flex-row gap-20">
            <div className="left">
              <form className=" flex flex-col justify-center items-start gap-8 ">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiUser className="text-gray-900 text-2xl" />
                  </div>
                  <input
                    className="w-full border border-gray-900 rounded-md py-3 pl-16 pr-3 placeholder:italic placeholder:text-gray-900 min-w-[20rem]"
                    placeholder="Email"
                    type="email"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiLock className="text-gray-900 text-2xl" />
                  </div>
                  <input
                    className="w-full border border-gray-900 rounded-md py-3 pl-16 pr-3 placeholder:italic placeholder:text-gray-900 min-w-[20rem]"
                    placeholder="Password"
                    type="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                  />
                </div>
                <div className="flex flex-row gap-3 items-center">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={remember ? "checked" : ""}
                    onChange={() => isRemember(!remember)}
                  ></input>
                  <span className="text-xl">Remeber Me</span>
                </div>
                {error !== "" && <div className="text-red-500">{error}</div>}
                <button
                  className="text-center w-full bg-gray-200 h-16 font-bold text-2xl"
                  onClick={loginSubmit}
                >
                  LOG IN
                </button>
              </form>
            </div>

            <div className="right">
              <div className="flex flex-col justify-center h-full gap-8">
                <form>
                  <select
                    className="w-full border-2 border-black font-bold rounded-xl py-3 pl-5 pr-3 placeholder:italic placeholder:text-gray-900 min-w-[20rem]"
                    onChange={(e) => choseCampus(e.target.value)}
                    defaultValue={"default"}
                  >
                    <option value="default">Select Campus</option>
                    <option value="1">Fu Hòa Lạc</option>
                    <option value="2">Fu Hồ Chí Minh</option>
                    <option value="3">Fu Đà Nẵng</option>
                    <option value="4">Fu Cần Thơ</option>
                    <option value="5">Fu Quy Nhơn</option>
                  </select>
                </form>
                <span className="font-semibold">Login your account on:</span>
                <button
                  {...buttonClick}
                  onClick={signInWithGoogle}
                  className="gap-3  w-full bg-gray-200 h-16 font-bold text-base flex flex-row items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="2rem"
                    height="2rem"
                    viewBox="0 0 256 262"
                    preserveAspectRatio="xMidYMid"
                  >
                    <path
                      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                      fill="#4285F4"
                    />
                    <path
                      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                      fill="#34A853"
                    />
                    <path
                      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                      fill="#FBBC05"
                    />
                    <path
                      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                      fill="#EB4335"
                    />
                  </svg>
                  <span>Login email @fpt.edu.vn</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
