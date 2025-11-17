interface DataProvider {
  timestamp: number;
  firstName: string;
}
const resetDataProvider = (): DataProvider => {
  let time = new Date().getTime()
  const data: DataProvider = {
    timestamp: time,
    firstName: `John_${time}`,
  }
  return data;
};
export { DataProvider, resetDataProvider };