// src/redux/reducers/userReducer.js
const initialState = {
    email: null,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_USER_EMAIL':
        return {
          ...state,
          email: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default userReducer;
  