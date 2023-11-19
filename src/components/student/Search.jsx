import { useEffect, useState } from "react";
import { PiArrowFatLineRightBold } from "react-icons/pi";
import { getAllUser } from "../../api";
import { Link } from "react-router-dom";
export default function Search({ chosePage }) {
  const [searchComponent, setSearchComponent] = useState("");
  const [lecturers, setLecturers] = useState([]);
  const [result, setResult] = useState([]);
  async function fetchData() {
    const response = await getAllUser()
      .then((data) =>
        setLecturers(data.filter((ifo) => ifo.role === "Lecturer"))
      )
      .catch((error) => console.log(error));
    console.log(lecturers);
  }
  useEffect(() => {
    fetchData();
    chosePage("Home");
  }, [lecturers.length === 0]);

  function handleSearching(e) {
    e.preventDefault();
    setSearchComponent(e.target.value);
    setResult(
      lecturers.filter((acc) =>
        acc.fullname.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  }
  function searchAll(e) {
    e.preventDefault();
    setResult(lecturers);
    setSearchComponent('')
  }
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5 py-10">
      <form className="flex flex-row justify-between w-1/3">
        <input
          value={searchComponent}
          onChange={(e) => handleSearching(e)}
          placeholder="Lecture's name"
          className="bg-gray-100 placeholder:text-gray-400 w-1/3 rounded-3xl py-3 pl-10 pr-3 placeholder:italic min-w-[15rem]"
        ></input>
        <button
          className="bg-orange-400 text-white rounded-3xl w-fit px-10"
          onClick={(e) => searchAll(e)}
        >
          Search All
        </button>
      </form>
      <div className="w-1/3 h-fit flex flex-col  p-10 border-orange-400 border-4 rounded-md min-h-[25%]">
        {result &&
          result.map((account) => (
            <Link to={`/Student/Booking/${account.id}`}>
              <div className="flex flex-row justify-between items-center w-full">
                <span className="text-xl">{account.fullname}</span>
                <button>
                  <PiArrowFatLineRightBold />
                </button>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
