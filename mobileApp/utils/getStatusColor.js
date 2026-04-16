const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING': return '#F59E0B'; // Orange
    case 'START': return '#3B82F6'; // Blue
    case 'FINISH': return '#10B981'; // Green
    default: return '#F59E0B';
  }
};

export default getStatusColor;
