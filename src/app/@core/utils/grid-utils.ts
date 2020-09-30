export class GridUtils {

  public static dateComparator(filterLocalDateAtMidnight, cellValue) {

    var dateAsString = cellValue;
    if (dateAsString == null) {
      return 0;
    }
    let day, month, year;
    if (typeof (dateAsString) === 'string') {
      var dateParts = dateAsString.split('-');
      day = Number(dateParts[2].split('T')[0]);
      month = Number(dateParts[1]) - 1;
      year = Number(dateParts[0]);
    } else {
      let cellDateVal: Date = cellValue;
      day = cellDateVal.getDate();
      month = cellDateVal.getMonth();
      year = cellDateVal.getFullYear();
    }

    var cellDate = new Date(year, month, day);
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    } else if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    } else {
      return 0;
    }
  }

  public static textFormatter(r) {
    if (r == null) { return null };
    return r
      .toLowerCase()
      .replace(/\s/g, '')
      .replace(/[àáâãäå]/g, 'a')
      .replace(/æ/g, 'ae')
      .replace(/ç/g, 'c')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/ñ/g, 'n')
      .replace(/[òóôõö]/g, 'o')
      .replace(/œ/g, 'oe')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ýÿ]/g, 'y')
      .replace(/\W/g, '');
  }

  public static customTextComparator(valueA, valueB) {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }
}
