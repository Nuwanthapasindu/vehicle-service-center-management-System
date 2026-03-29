import * as Yup from "yup";

const CreateTeamSchema = Yup.object().shape({
  name: Yup.string()
    .required("Team name is required")
    .matches(/^\s*\S.*$/, "Team name cannot be empty"),

  employees: Yup.array()
    .of(
      Yup.string().matches(/^[0-9a-fA-F]{24}$/, "Invalid Employee ID format")
    )
    .min(1, "A team must have at least one employee")
    .required("Employees are required"),
});

export default CreateTeamSchema;