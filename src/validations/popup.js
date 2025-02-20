import * as yup from 'yup';

const namePattern = /^[a-zA-Z,'"-.]+$/;

/*
Matches: "J.", "A", "B."
Doesnt match: "AB" "J.S." (more than one letter after the first period)
*/
const clientInitialsPattern = /^[A-Z]{1,2}\.?$/i;

/*
Matches: "1905","1950","1999","2010","2088",
Doens't match: 
"1899" (before the earliest year in the range), 
"2100" (after the latest year in the range),
"200" (too short) "20000" (too long)
*/
const yearOfBirthPattern = /^(19|20)\d{2}$/;

const registerSchema = yup.object().shape({
  clientInitials: yup
    .string('Enter Client initials')
    .matches(clientInitialsPattern, 'Client initials are not valid')
    .required('Client initials are required')
    .max(2, 'Client Initials are too long - should be 2 chars maximum'),

  yearOfBirth: yup
    .string('Enter your year of birth')
    .matches(yearOfBirthPattern, 'Year of birth is not valid')
    .max(4, 'Year of birth is too long - should be 4 chars maximum'),

  purposeOfCollection: yup
    .string('Enter purpose of collection')
    .required('Purpose of collection is required'),

  // gender: yup.string().required('A radio option is required'),

  // resourcesProvided: yup.object().shape({
  //   needleKit: yup
  //     .boolean()
  //     .oneOf([true], 'At least one resource must be provided'),
  //   needleKit1CC: yup.boolean(),
  //   needleKit12CC: yup.boolean(),
  //   needleKitShorts: yup.boolean()
  // })
});

export default registerSchema;
