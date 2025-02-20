// Returns the age group of a user based on their date of birth
function getAge(date_of_birth) {
  const today = new Date();
  const birthDate = new Date(date_of_birth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age -= 1;
  return age;
}

export default getAge;
