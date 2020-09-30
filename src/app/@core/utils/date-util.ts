export class DateUtil {
  public static addDays(date, days) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
  }

  public static substractDays(date, days) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() - days)
    return copy
  }

  public static CheckIfOneDateIsBetweenTwoDates(dateFrom, dateTo, dateCheck) {
    if (dateFrom && dateTo && dateCheck) {
      if (typeof (dateFrom) === 'string' && typeof (dateTo) === 'string' && typeof (dateCheck) === 'string') {
        let d1: string[] = dateFrom.split("/");
        let d2: string[] = dateTo.split("/");
        let c: string[] = dateCheck.split("/");

        let fromDate = new Date(parseInt(d1[2]), parseInt(d1[1]) - 1, parseInt(d1[0]));  // -1 because months are from 0 to 11
        let toDate = new Date(parseInt(d2[2]), parseInt(d2[1]) - 1, parseInt(d2[0]));
        let checkDate = new Date(parseInt(c[2]), parseInt(c[1]) - 1, parseInt(c[0]));
        return checkDate > fromDate && checkDate < toDate;
      } else {
        let from = Date.parse(dateFrom);
        let to = Date.parse(dateTo);
        let check = Date.parse(dateCheck);
        return check >= from && check <= to;
      }
    } else {
      return false;
    }
  }

  public static CheckIfDateRangeOverlaps(StartDate1: Date, EndDate1: Date, StartDate2: Date, EndDate2: Date) {
    debugger;
    if (StartDate1 && EndDate1 && StartDate2 && EndDate2) {
        return (StartDate1 <= EndDate2) && (StartDate2 <= EndDate1);
    } else {
      return false;
    }
  }

}
