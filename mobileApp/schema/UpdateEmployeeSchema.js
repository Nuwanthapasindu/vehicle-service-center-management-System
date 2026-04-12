import * as Yup from "yup";
import enums from "../constants/enums";

const { USER_ROLES, GENDERS } = enums;

const UpdateEmployeeSchema = Yup.object().shape({
  name: Yup.string().min(5, "Name must be at least 5 characters").max(50, "Name must be at most 50 characters").trim(),
  mobile: Yup.string().matches(/^(?:\+94|94|0)?7[0-8]\d{7}$/, "Please provide a valid Sri Lankan mobile number"),
  address: Yup.string().min(5).max(70).trim(),
  role: Yup.string().oneOf([USER_ROLES.MECHANIC], "Role must be a MECHANIC"),
  userName: Yup.string().matches(/^[a-zA-Z0-9]+$/, "Username must only contain letters and numbers"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password must be at most 30 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/, 
             "Password must contain at least one uppercase, one lowercase, one number, and one special character"),
  dob: Yup.date().typeError("Date of birth must be a valid date"),
  nic: Yup.string().matches(
  /^(\d{9}[vVxX]|\d{12})$/,
  "NIC must be valid (e.g., 912345678V or 200012345678)"
  ),
  skills: Yup.array().of(Yup.string()).min(1, "At least one skill must be selected"),
  gender: Yup.string().oneOf(Object.values(GENDERS), "Gender is invalid"),
  isAvailable: Yup.boolean(),
});
export default UpdateEmployeeSchema;