export const objectToParams = (filters) => {
  let queryString = "?";
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((elem) => {
        // Replace the space with a "-"
        const replacedElem = elem.replace(" ", "-");
        queryString += `${key}=${replacedElem}&`;
      });
    } else {
      queryString += `${key}=${value}&`;
    }
  });
  queryString = queryString.slice(0, -1);
  console.log(queryString);
  return queryString;
};

export const isoDateToMonthAndYear = (isoDate) => {
  return new Date(isoDate).toLocaleString("default", { month: "long", year: "numeric" });
};
