function allUserReducer(state = null, action) {
  switch (action.type) {
    case "GET_ALL_USER":
      return state;

    case "SET_ALL_USER":
      return {
        ...state,
        allUsers: action.allUsers,
      };
    default:
      return state;
  }
};

export default allUserReducer;