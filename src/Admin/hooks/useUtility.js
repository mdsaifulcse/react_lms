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

  return {
    generateDateForApi,
  };
}
