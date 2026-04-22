import * as Yup from "yup";
import enums from "../constants/enums";

const { USER_ROLES, GENDERS } = enums;

const AddEmployeeSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(5, "Name must be at least 5 characters long")
    .max(50, "Name must be at most 50 characters long")
    .matches(/^\s*\S.*$/, "Name cannot be empty"),

  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^(?:\+94|94|0)?7[0-8]\d{7}$/, "Please provide a valid Sri Lankan mobile number"),

  address: Yup.string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters long")
    .max(70, "Address must be at most 70 characters long"),

  role: Yup.string()
    .required("Role is required")
    .oneOf([USER_ROLES.MECHANIC], "Role must be a MECHANIC"),

  dob: Yup.date()
    .required("Date of birth is required")
    .typeError("Date of birth must be a valid date"),

  nic: Yup.string()
  .required("NIC is required")
  .matches(
    /^(\d{9}[vVxX]|\d{12})$/,
    "NIC must be valid (e.g., 912345678V or 200012345678)"
  ),  

  skills: Yup.array()
    .of(Yup.string().required())
    .min(1, "At least one skill must be selected"),

  gender: Yup.string()
    .required("Gender is required")
    .oneOf(Object.values(GENDERS), "Gender is invalid"),

  userName: Yup.string()
    .required("Username is required")
    .matches(/^[a-zA-Z0-9]+$/, "Username must only contain letters and numbers"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password must be at most 30 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/,
      "Password must contain at least one uppercase, one lowercase, one number, and one special character"
    ),
});

export default AddEmployeeSchema;