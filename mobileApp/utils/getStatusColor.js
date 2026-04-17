import enums from "../constants/enums";

const getStatusColor = (status) => {
  switch (status) {
    case enums.JOBCARD_STATUS.PENDING:
      return "#F59E0B"; // Orange
    case enums.JOBCARD_STATUS.START:
      return "#3B82F6"; // Blue
    case enums.JOBCARD_STATUS.FINISH:
      return "#10B981"; // Green
    default:
      return "#F59E0B";
  }
};

export default getStatusColor;

