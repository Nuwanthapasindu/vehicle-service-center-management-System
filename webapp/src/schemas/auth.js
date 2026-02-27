import * as Yup from "yup";


const loginValidationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required").min(4, "Username must be at least 4 characters long"),
  password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters long"),
});


export {
  loginValidationSchema,

};
