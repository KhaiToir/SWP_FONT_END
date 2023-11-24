import { useEffect, useState } from "react";
import { updateAccountById, getAllSubject } from "../../api";
import Select from "react-dropdown-select";
import { format } from "date-fns";

export default function AdminUpdateAccount({ setRefresh, updateObject }) {
  console.log("update", updateObject);
  const zeroFormData = {
    username: "",
    password: "",
    fullname: "",
    email: "",
    dob: "",
    role: "Student",
    subjectId: [],
  };
  const [subjectList, setSubjectList] = useState([]);
  const [formData, setFormData] = useState(zeroFormData);
  const [updateHolder, setUpdateHolder] = useState(null);
  const [errors, setErrors] = useState({});
  const [added, setAdded] = useState("");

  async function makePutRequest(form, id) {
    try {

      const response = await updateAccountById(form, parseInt(id));
      return response;
    } catch (error) {
      // Handle errors here
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    // Validate the form
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const submited = {
        ...formData,
        dob: format(new Date(formData.dob), "yyyy-MM-dd'T'00:00:00", {
          timeZone: "UTC",
        }),
      };
      console.log("Submited", submited);
      // No validation errors, proceed with the submission
      const result = await makePutRequest(submited, parseInt(updateObject.id));
      setAdded(result);
      setRefresh(true);
    }
  }

  const cancelAll = () => {
    setFormData(zeroFormData);
    setErrors({});
    setAdded("");
  };

  const validateForm = () => {
    const newErrors = {};
    // Check if the fullname is not empty
    if (!formData.fullname) {
      newErrors.fullname = "Full name is required";
    } else if (/^\d/.test(formData.fullname)) {
      newErrors.fullname = "Full name cannot start with a number";
    }
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    }
    if (!formData.username) {
      newErrors.username = "Username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    // Check if the email is a valid email address based on the role
    if (formData.role === "Student") {
      // For students, validate the email as "xxxse123456@fpt.edu.vn"
      if (
        !/^[A-Za-z0-9._%+-]+(se|sa|ss|SE|SA|SS)\d{6}@fpt.edu.vn$/.test(
          formData.email
        )
      ) {
        newErrors.email = newErrors.email =
          "Invalid email format. It should end with 'ss','se','sa','SS,' 'SE,' or 'SA' followed by 6 digits, e.g., 'exampleSS123456@fpt.edu.vn'";
      }
    } else {
      // For other roles, validate the email as "xxxxx@fpt.edu.vn"
      if (!/^[A-Za-z0-9._%+-]+@fpt.edu.vn$/.test(formData.email)) {
        newErrors.email =
          "Invalid email format. It should be in the format 'xxxxx@fpt.edu.vn'";
      }
      if (Object.keys(formData.subjectId).length <= 0) {
        newErrors.subjectId = "Chose at least 1 Subject.";
      }
    }

    // Add more validation rules for other fields as needed

    return newErrors;
  };

  const getSubjects = async () => {
    try {
      const result = await getAllSubject().then((data) => setSubjectList(data.filter((course) => course.status !== "Unactive")));
    } catch (e) {}
  };
  const findSubject = (arraySub) => {
    let result = [];
    console.log("arraySub", arraySub);
    if (subjectList.length > 0) {
      arraySub.map((subI) => {
        const found = subjectList.find(
          (sub) => parseInt(sub.id) === parseInt(subI)
        );
        if (found) {
          result.push(found);
        }
      });
    }
    console.log(result);
    return result;
  };

  useEffect(() => {
    getSubjects();
  }, []);
  useEffect(() => {
    setUpdateHolder(updateObject);
    setFormData({
      username: updateObject.username,
      password: updateObject.password,
      fullname: updateObject.fullname,
      email: updateObject.email,
      dob: new Date(updateObject.dob).toLocaleDateString("en-CA"),
      role: updateObject.role,
      subjectId: updateObject.subjectId,
    });
  }, [updateObject]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center pb-10">
      <div className="w-[90%] h-fit mt-[5%] flex flex-col justify-center gap-3 items-start px-10 py-3 border-orange-400 border-4 rounded-md min-h-[20%]">
        <span className="font-semibold text-2xl mb-5">Update account</span>
        {added && (
          <div
            className={`text-xl ${
              added === "Account update successfully."
                ? "text-green-500"
                : "text-red-500"
            } font-semibold`}
          >
            {added}
          </div>
        )}
        <form
          className="w-[80%] mx-auto flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-row w-full items-center">
            <span className="text-xl font-medium w-[30%]">Full Name</span>
            <input
              onChange={handleInputChange}
              name="fullname"
              value={formData.fullname}
              className={`border ${
                errors.fullname ? "border-red-500 border-2" : "border-gray-900"
              } rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
              type="text"
            ></input>
          </div>
          {errors.fullname && <p className="text-red-500">{errors.fullname}</p>}
          <div className="flex flex-row w-full items-center">
            <span className="text-xl font-medium w-[30%]">DoB</span>
            <input
              onChange={handleInputChange}
              name="dob"
              value={formData.dob}
              className={`border ${
                errors.dob ? "border-red-500 border-2" : "border-gray-900"
              } rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
              type="date"
            ></input>
          </div>
          {errors.dob && <p className="text-red-500">{errors.dob}</p>}
          <div className="flex flex-row w-full items-center">
            <span className="text-xl font-medium w-[30%]">Role</span>
            <select
              name="role"
              onChange={handleInputChange}
              className=" border border-gray-900 rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]"
              type="text"
              value={formData.role}
            >
              <option value="Student">Student</option>
              <option value="Lecturer">Lecturer</option>
            </select>
          </div>
          <div className="flex flex-row w-full items-center">
            <span className="text-xl font-medium w-[30%]">Username</span>
            <input
              onChange={handleInputChange}
              name="username"
              value={formData.username}
              className={`border ${
                errors.username ? "border-red-500 border-2" : "border-gray-900"
              } rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
              type="text"
            ></input>
          </div>
          {errors.username && <p className="text-red-500">{errors.username}</p>}
          <div className="flex flex-row w-full items-center">
            <span className="text-xl font-medium w-[30%]">Password</span>
            <input
              onChange={handleInputChange}
              name="password"
              value={formData.password}
              className={`border ${
                errors.fullname ? "border-red-500 border-2" : "border-gray-900"
              } rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
              type="text"
            ></input>
          </div>
          {errors.password && <p className="text-red-500">{errors.password}</p>}
          <div className="flex flex-row w-full items-center">
            <span className="text-xl font-medium w-[30%]">Email</span>
            <input
              onChange={handleInputChange}
              name="email"
              value={formData.email}
              className={`border ${
                errors.email ? "border-red-500 border-2" : "border-gray-900"
              } rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
              type="email"
            ></input>
          </div>

          {errors.email && <p className="text-red-500">{errors.email}</p>}
          {formData.role && formData.role === "Lecturer" ? (
            <div className="flex flex-row w-full items-center">
              <span className="text-xl font-medium w-[30%]">Subjet</span>
              <Select
                name="subjectId"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    "subjectId": e.map((sub) => {
                      return sub.id;
                    }),
                  });
                }}
                className={`border ${
                  errors.subjectId
                    ? "border-red-500 border-2"
                    : "border-gray-900"
                } rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem] max-w-[15rem]`}
                id="subjectId"
                options={subjectList}
                labelField="subjectCode"
                valueField="id"
                multi
                values={formData?.subjectId &&findSubject(formData?.subjectId)}
              ></Select>
            </div>
          ) : (
            <></>
          )}
          {errors.subjectId && (
            <p className="text-red-500">{errors.subjectId}</p>
          )}
          <div className="flex flex-row  w-full items-center justify-center gap-10">
            <button
              className="text-white bg-red-500 px-3 py-2 rounded-xl border-black border-2"
              onClick={cancelAll}
            >
              Cancel
            </button>
            <button
              className="text-white bg-green-500 px-3 py-2 rounded-xl border-black border-2"
              type="submit"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
