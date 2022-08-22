

const getQueueTimes = async (id) => {
  const response = await fetch(`https://queue-times.com/fr/parks/${id}/queue_times.json`);

  return response.json();
};

export {
  getQueueTimes
}
