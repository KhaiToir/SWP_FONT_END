export const setAllUsers = (data) => {
  return {
    type: "SET_ALL_USER",
    allUsers: data,
  };
};

export const getAllUsers = (data) => {
  return {
    type: "GET_ALL_USER",
  };
};