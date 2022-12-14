const getQueueTimes = async (id) => {
  const response = await fetch(process.env.REACT_APP_API_URL.replace('{{id}}', id));

  return response.json();
};

export default getQueueTimes;
