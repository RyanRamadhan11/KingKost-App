export default DateFormatter = {
  formatDate: (dateStr, format) => {
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    switch (format) {
      case "dd/mm/yyyy":
        return `${day < 10 ? "0" + day : day}/${
          month < 10 ? "0" + month : month
        }/${year}`;
      case "dd-mm-yyyy":
        return `${day < 10 ? "0" + day : day}-${
          month < 10 ? "0" + month : month
        }-${year}`;
      case "mm/dd/yyyy":
        return `${month < 10 ? "0" + month : month}/${
          day < 10 ? "0" + day : day
        }/${year}`;
      case "yyyy-mm-dd":
        return `${year}-${month < 10 ? "0" + month : month}-${
          day < 10 ? "0" + day : day
        }`;
      default:
        return "Format tidak valid";
    }
  },
};
