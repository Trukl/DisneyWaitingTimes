

const getQueueTimes = async (id) => {
  const response = await fetch(`/fr/parks/${id}/queue_times.json`, {
  });

  console.log(response)
  return response.json();
};

export {
  getQueueTimes
}
