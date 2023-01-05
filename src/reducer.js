const reducer = (state, action) => {
  switch (action.type) {
    case "EDIT_BLOG_ID":
      return {
        ...state,
        editDocId: action.editDocId,
      }

    case "SET_USER":
      return {
        ...state,
        user: action.user,
      }

    case "SET_USERNAME":
      return {
        ...state,
        username: action.username,
      }

    case "SIGN_OUT":
      return {
        ...state,
        user: "",
        username: "",
      }
    
      default:
        return state;
  }
}

export default reducer;