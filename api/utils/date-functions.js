// Get the quarter of the year based on Syme-Woolner quarter system from the provided date
function getQuarter(current_date) {
  if (current_date.getMonth() >= 3 && current_date.getMonth() <= 5) return 1;
  else if (current_date.getMonth() >= 6 && current_date.getMonth() <= 8)
    return 2;
  else if (current_date.getMonth() >= 9 && current_date.getMonth() <= 11)
    return 3;
  else if (current_date.getMonth() >= 0 && current_date.getMonth() <= 2)
    return 4;
}

// Get the quarter of the year based on Syme-Woolner quarter system from the provided month
function getQuarterFromNumeric(month) {
  if (month >= 4 && month <= 6) return 1;
  else if (month >= 7 && month <= 9) return 2;
  else if (month >= 10 && month <= 12) return 3;
  else if (month >= 1 && month <= 3) return 4;
}

function dateToCurrent(date) {
  const standard_date = date ? new Date(date) : new Date();
  return standard_date.toISOString().slice(0, 10);
}

export { getQuarter, getQuarterFromNumeric, dateToCurrent };
