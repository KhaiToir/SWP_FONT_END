import { useEffect, useState } from "react";
import { updateAccountById } from "../../api";

export default function AdminUpdateAccount({ setRefresh, updateObject }) {
  const zeroFormData = {
    username: "",
    password: "",
    fullname: "",
    email: "",
    dob: "",
    role: "Student",
  };

  const [formData, setFormData] = useState(zeroFormData);
  const [updateHolder, setUpdateHolder] = useState(null);
  const [errors, setErrors] = useState({});
  const [added, setAdded] = useState(false);

  async function makePutRequest(form, id) {
    try {
      console.log(form);
      const response = await updateAccountById(form, id);
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
      // No validation errors, proceed with the submission
      console.log("Form submitted:", formData);
      await makePutRequest(formData, updateHolder.id);
      setAdded(true);
      setRefresh(true);
    }
  }

  const cancelAll = () => {
    setFormData(zeroFormData);
    setErrors({});
    setAdded(false);
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
      if (!/^[A-Za-z0-9._%+-]+(se|sa|ss|SE|SA|SS)\d{6}@fpt.edu.vn$/.test(formData.email)) {
        newErrors.email =
          "Invalid email format. It should end with 'ss,' 'se,' 'sa,' 'SS,' 'SE,' or 'SA' followed by 6 digits, e.g., 'exampleSS123456@fpt.edu.vn'";
      }
    } else {
      // For other roles, validate the email as "xxxxx@fpt.edu.vn"
      if (!/^[A-Za-z0-9._%+-]+@fpt.edu.vn$/.test(formData.email)) {
        newErrors.email = "Invalid email format. It should be in the format 'xxxxx@fpt.edu.vn'";
      }
    }

    return newErrors;
  };

  useEffect(() => {
    if (updateObject !== null) {
      setUpdateHolder(updateObject);
      setFormData({
        username: updateObject.username,
        password: updateObject.password,
        fullname: updateObject.fullname,
        email: updateObject.email,
        dob: new Date(updateObject.dob).toLocaleDateString('en-CA'),
        role: updateObject.role,
      });
    }
  }, [updateObject]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center pb-10">
      <div className="w-[90%] h-fit mt-[5%] flex flex-col justify-center gap-3 items-start px-10 py-3 border-orange-400 border-4 rounded-md min-h-[20%]">
        <span className="font-semibold text-2xl mb-5">Update account</span>
        {added && (
          <p className="text-green-500 font-semibold text-lg mb-5">Update successfully!!!</p>
        )}
        <form className="w-[80%] mx-auto flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-row w-full items-center">
            <span className="text-xl font-medium w-[30%]">Full Name</span>
            <input
              onChange={handleInputChange}
              name="fullname"
              value={formData.fullname}
              className={`border ${errors.fullname ? "border-red-500 border-2" : "border-gray-900"} rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
              type="text"
            />
          </div>
          {errors.fullname && <p className="text-red-500">{errors.fullname}</p>}
          <div className="flex flex-row w-full items-center">
            <span className="text-xl font-medium w-[30%]">DoB</span>
            <input
              onChange={handleInputChange}
              name="dob"
              value={formData.dob}
              className={`border ${errors.dob ? "border-red-500 border-2" : "border-gray-900"} rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
              type="date"
            />
          </div>
          {errors.dob && <p className="text-red-500">{errors.dob}</p>}
          <div className="flex flex-row w-full items-center">
            <span className="text-xl font-medium w-[30%]">Role</span>
            <input
              name="role"
              className="border border-gray-900 rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]"
              value={formData.role}
              readOnly
            >
            </input>
          </div>
          <div className="flex flex-row w-full items-center">
            <span className="text-xl font-medium w-[30%]">Username</span>
            <input
              onChange={handleInputChange}
              name="username"
              value={formData.username}
              className={`border ${errors.username ? "border-red-500 border-2" : "border-gray-900"} rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
              type="text"
            />
          </div>
          {errors.username && <p className="text-red-500">{errors.username}</p>}
          <div className="flex flex-row w-full items-center">
            <span className="text-xl font-medium w-[30%]">Password</span>
            <input
              onChange={handleInputChange}
              name="password"
              value={formData.password}
              className={`border ${errors.password ? "border-red-500 border-2" : "border-gray-900"} rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
              type="text"
            />
          </div>
          {errors.password && <p className="text-red-500">{errors.password}</p>}
          <div className="flex flex-row w-full items-center">
            <span className="text-xl font-medium w-[30%]">Email</span>
            <input
              onChange={handleInputChange}
              name="email"
              value={formData.email}
              className={`border ${errors.email ? "border-red-500 border-2" : "border-gray-900"} rounded-sm py-1 pl-5 pr-3 placeholder:italic bg-gray-200 placeholder:text-gray-400 w-[15rem]`}
              type="email"
            />
          </div>
          {errors.email && <p className="text-red-500">{errors.email}</p>}
          <div className="flex flex-row w-full items-center justify-center gap-10">
            <button
              type="button"
              className="text-white bg-red-500 px-3 py-2 rounded-xl border-black border-2"
              onClick={cancelAll}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white bg-green-500 px-3 py-2 rounded-xl border-black border-2"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
