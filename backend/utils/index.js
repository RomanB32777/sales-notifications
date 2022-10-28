const { fileFilter, deleteFileByName, deleteOldFiles } = require("./files");

const getTimeCurrentPeriod = (field, period) => {   
  // period = "day" | "week" | "month" | "year" | "all"
  if (period === "all") return "true";
  return `date_trunc('${period}', ${field}) = date_trunc('${period}', current_date)`;
};

module.exports = {
  fileFilter,
  deleteFileByName,
  deleteOldFiles,
  getTimeCurrentPeriod,
};
