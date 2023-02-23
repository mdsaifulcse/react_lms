export default function useUtility() {
  const generateDateForApi = (dateString) => {
    return (
      dateString.getFullYear() +
      "-" +
      dateString.getMonth() +
      "-" +
      dateString.getUTCDate()
    );
  };
  const formatAMPM = async (dateString) => {
    var date = new Date(dateString);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return [strTime];
  };

  return {
    generateDateForApi,
    formatAMPM,
  };
}
