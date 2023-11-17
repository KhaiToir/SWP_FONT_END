import { useSelector } from "react-redux";
import { Avatar } from "../assets";
import { AiOutlineCalendar } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { signOutAction } from "../ultils/helpers";
import { buttonClick } from "../animations";
import { getAllNotification } from "../api";
import { useEffect, useState } from "react";

function Header({ notifications }) {
  const [notificationsList, setNotificationList] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const user = useSelector((state) => state.user?.user);
  const userId = user?.id;
  //Split the content of the notification in api into 2 parts.
  const splitString = (value) => {
    const result = value.split("Location");
    return result;
  };
  useEffect(() => {
    // Update notificationsList only if notifications prop is provided)

      if (notifications) {
        setNotificationList(
          notifications.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            // Compare dateB with dateA to sort from newest to oldest
            return dateB - dateA;
          })
        );
      
    }
  }, [notifications]);

  return (
    <div className="flex w-full bg-orange-400 h-[4rem] items-center relative">
      <div className="mx-10 uppercase text-white w-full">meet lecturer</div>
      {/* {user && ( */}
      <div className="absolute bottom-0 right-0 text-white flex items-center space-x-2 gap-5 pr-5 pb-3">
        <div>{user.fullname}</div>
        <img src={Avatar} alt="avatar" className="w-10 rounded-full" />
        <Link to={`/${user.role}/Schedule`}>
          <AiOutlineCalendar className="text-4xl" />
        </Link>
        <button
          onClick={() =>
            setNotificationOpen((notificationOpen) => !notificationOpen)
          }
        >
          <IoMdNotificationsOutline className="text-4xl " />
        </button>
        <div
          {...buttonClick}
          onClick={signOutAction}
          className="cursor-pointer"
        >
          <MdLogout className="text-4xl" />
        </div>
      </div>

      {/* )} */}
      {notificationOpen === true ? (
        notificationsList && notificationsList.length > 0 ? (
          <div className="absolute right-0 -bottom-[15rem] flex-col bg-gray-300 w-[24rem] h-[15rem] flex overflow-y-scroll z-50">
            <div className="w-full pl-5 p-3 text-xl font-semibold">
              Notifications
            </div>
            <div className="wrap whitespace-pre-wrap bg-gray flex flex-col px-5 gap-3 bg-gray-300 pb-5">
              {notificationsList &&
                notificationsList.map((infor, index) => (
                  <div
                    key={index}
                    className="px-3 bg-amber-500 py-2 flex flex-col"
                  >
                    <span className="font-medium">
                      {splitString(infor.title)[0]}
                    </span>
                    <span>Slot {splitString(infor.title)[1]}</span>
                    {/* <button className="text-xs text-left w-fit underline text-blue-600">Make as readed</button> */}
                  </div>
                ))}
              {/* <button className="text-left w-fit border border-black px-3 bg-white">Read All</button> */}
            </div>
          </div>
        ) : (
          <div className="absolute right-0 -bottom-[168%] flex-col bg-gray-300 w-[24rem] h-[7rem] flex overflow-y-scroll z-50">
            <div className="w-full pl-5 p-3 text-xl font-semibold">
              Notifications
            </div>
            <div className="wrap whitespace-pre-wrap bg-gray flex flex-col px-5 gap-3 bg-gray-300 pb-5">
              <div className="px-3 bg-amber-500 py-2">
                <span>There is no notification here!!!</span>
              </div>
            </div>
          </div>
        )
      ) : (
        <></>
      )}
    </div>
  );
}

export default Header;
