export default function getLocalDate() {
    const date = new Date();
    const tzString = date.toLocaleString("en-US", {timeZone: "America/Toronto"});
    const localDate = new Date(tzString);
    const year = localDate.getFullYear();
    let month = localDate.getMonth() + 1;
    let day = localDate.getDate();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
  
    return `${year}-${month}-${day}`;
  }