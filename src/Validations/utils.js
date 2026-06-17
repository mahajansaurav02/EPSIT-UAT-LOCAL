//only for Textfield
export const filterOnlyLettersAndSpaces = (value) => {
  return value
    .replace(/[^A-Za-z\s.]/g, "")
    .replace(/\s+/g, " ")
    .trimStart();
};

//only for Email Textfield
export const filterOnlyLettersNumbersAndSpaces = (value) => {
  return value
    .replace(/[^A-Za-z0-9\s@.]/g, "")
    .replace(/\s+/g, " ")
    .trimStart();
};

//only for Comopany Textfield
export const filterOnlyLettersNumbersDotAndSpaces = (value) => {
  return value
    .replace(/[^A-Za-z0-9\s.]/g, "")
    .replace(/\s+/g, " ")
    .trimStart();
};

//only for Address Textfield
export const filterOnlyLettersNumbersCommaDotAndSpaces = (value) => {
  return value
    .replace(/[^\u0900-\u097Fa-zA-Z0-9\s.,]/g, "")
    .replace(/[०-९]/g, "")
    .replace(/\s+/g, " ")
    .trimStart();
};

//only for Translation Textfield
export const filterOnlyMarathiAndEnglishLettersWithSpaces = (value) => {
  return (
    value
      .replace(/[^\u0900-\u097Fa-zA-Z\s.]/g, "")
      // .replace(/[^a-zA-Z\u0900-\u097F ]/g, "")
      .replace(/\s+/g, " ")
      .trimStart()
  );
};

//only for MryutuDakhla no. Textfield
export const filterOnlyLettersNumbersAndSpacesForMryutuDakhlaNo = (value) => {
  return value
    .replace(/[^\u0900-\u097Fa-zA-Z0-9\s]/g, "")
    .replace(/[०-९]/g, "")
    .replace(/\s+/g, " ")
    .trimStart();
};

// only allow marathi letter and marathi no (Dharnadhikar Mutation)
export const filterOnlyMarathiLettersAndSpaces = (value) => {
  return value
    .replace(/[^\u0900-\u097F\s]/g, "")
    .replace(/\s+/g, " ")
    .trimStart();
};
