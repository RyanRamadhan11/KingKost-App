export default MonthTypeConverter = {
  getMonthCount: (monthType) => {
    switch (monthType) {
      case "ONE_MONTH":
        return 1;
      case "TWO_MONTH":
        return 2;
      case "THREE_MONTH":
        return 3;
      case "FOUR_MONTH":
        return 4;
      case "FIVE_MONTH":
        return 5;
      case "SIX_MONTH":
        return 6;
      case "SEVEN_MONTH":
        return 7;
      case "EIGHT_MONTH":
        return 8;
      case "NINE_MONTH":
        return 9;
      case "TEN_MONTH":
        return 10;
      case "ELEVEN_MONTH":
        return 11;
      case "TWELVE_MONTH":
        return 12;
      default:
        return 0;
    }
  },
};
