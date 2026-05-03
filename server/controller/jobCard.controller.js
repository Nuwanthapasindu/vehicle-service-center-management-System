const JobCard = require("../model/JobCard");
const Team = require("../model/Team");
const Employee = require("../model/Employee");
const Booking = require("../model/Booking");
const Package = require("../model/Package");
const Service = require("../model/Service");
const Vehicle = require("../model/Vehicle");
const AppError = require("../error/AppError");
const {
  createJobCardSchema,
  assignTeamSchema,
} = require("../validation/jobCard.validation");
const { getAllServicesForJobCard } = require("./service.controller");
const { getAllPackagesForJobCard } = require("./package.controller");
const { JOBCARD_STATUS } = require("../util/constants");

// ADMIN: Create a Job Card
exports.createJobCard = async (payload) => {
  const { error, value } = createJobCardSchema.validate(payload);
  if (error) throw new AppError(error.details[0].message, 400);

  const existingCard = await JobCard.findOne({
    booking: value.booking,
    isDeleted: false,
  });
  if (existingCard) throw new AppError("Job Card already exists", 400);

  const newJobCard = await JobCard.create({
    booking: value.booking,
    selectedPackage: value.selectedPackage,
    milageCount: value.milageCount,
    status: JOBCARD_STATUS.PENDING,
  });

  return newJobCard;
};

// ADMIN: Get Eligible Teams
exports.getEligibleTeamsForJob = async () => {
  const availableEmployees = await Employee.find({
    isAvailable: true,
    isDeleted: false,
  }).select("_id");

  if (availableEmployees.length === 0) return [];

  const employeeIds = availableEmployees.map((emp) => emp._id);

  const teams = await Team.find({
    employees: { $in: employeeIds },
    isDeleted: false,
  }).populate({
    path: "employees",
    match: { isAvailable: true, isDeleted: false },
  });

  return teams.filter((team) => team.employees && team.employees.length > 0);
};

// ADMIN: Assign Team
exports.assignTeam = async (payload) => {
  const { error, value } = assignTeamSchema.validate(payload);
  if (error) throw new AppError(error.details[0].message, 400);

  const team = await Team.findById(value.teamId);
  if (!team) throw new AppError("Team not found", 404);

  const jobCard = await JobCard.findByIdAndUpdate(
    value.jobCardId,
    {
      team: value.teamId,
      status: JOBCARD_STATUS.START,
      startTime: new Date(),
    },
    { new: true },
  ).populate("team");

  await Employee.updateMany(
    { _id: { $in: team.employees } },
    { $set: { isAvailable: false } },
  );

  return jobCard;
};

// EMPLOYEE: Get My Tasks
exports.getMyTasks = async (user) => {
  if (!user || !user.nic)
    throw new AppError("Employee identity not found", 401);

  const employeeRecord = await Employee.findOne({
    nic: user.nic,
    isDeleted: false,
  });
  if (!employeeRecord) throw new AppError("Employee record not found", 404);

  const myTeams = await Team.find({
    employees: employeeRecord._id,
    isDeleted: false,
  }).select("_id");
  const teamIds = myTeams.map((t) => t._id);

  return await JobCard.find({
    team: { $in: teamIds },
    isDeleted: false,
    status: { $in: [JOBCARD_STATUS.PENDING, JOBCARD_STATUS.START] },
  })
    .populate({
      path: "booking",
      populate: [
        { path: "vehicle" },
        { path: "customer", select: "name mobile" },
      ],
    })
    .populate("selectedPackage")
    .sort({ createdAt: -1 });
};

// ADMIN: Get All Bookings (Available for JobCards)
exports.getAllBookings = async () => {
  const bookings = await Booking.find({ isDeleted: false })
    .populate("customer", "name mobile")
    .populate("vehicle")
    .sort({ date: -1 });

  const existingJobCardBookingIds = await JobCard.find({
    isDeleted: false,
  }).distinct("booking");
  const idStrings = existingJobCardBookingIds.map((id) => id.toString());

  return bookings.filter(
    (booking) => !idStrings.includes(booking._id.toString()),
  );
};
exports.getAllServices = async () => {
  return await getAllServicesForJobCard();
};
exports.getAllPackages = async () => {
  return await getAllPackagesForJobCard();
};
