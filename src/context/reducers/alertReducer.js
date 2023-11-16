function alertReducer(state = null, action) {
  switch (action.type) {
    case "SET_SUCCESS":
      return {
        ...state,
        alert: action.alert,
      };
    case "SET_WARNING":
      return {
        ...state,
        alert: action.alert,
      };

    case "SET_DANGER":
      return {
        ...state,
        alert: action.alert,
      };

    case "SET_INFO":
      return {
        ...state,
        alert: action.alert,
      };

    case "SET_ALERT_NULL":
      return {
        ...state,
        alert: action.alert,
      };

    default:
      return state;
  }
}

export default alertReducer;
