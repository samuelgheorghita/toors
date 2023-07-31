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

export const handleTabKey = (e, modalRef) => {
  // Following line is to avoid conflict between the 2 modals in this page
  if (!modalRef.current) return;

  const focusableModalElements = Array.from(
    modalRef.current.querySelectorAll('a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select')
  );
  const firstElement = focusableModalElements[0];
  const lastElement = focusableModalElements[focusableModalElements.length - 1];

  if (!focusableModalElements.includes(document.activeElement)) {
    firstElement.focus();
    return e.preventDefault();
  }

  // The following lines commented should work but they don't. Instead it works without.
  // if (!e.shiftKey && document.activeElement === lastElement) {
  //   firstElement.focus();
  //   return e.preventDefault();
  // }

  // if (e.shiftKey && document.activeElement === firstElement) {
  //   lastElement.focus();
  //   return e.preventDefault();
  // }
};
