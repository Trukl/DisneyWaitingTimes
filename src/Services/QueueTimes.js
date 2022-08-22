

const getQueueTimes = async (id) => {
  const response = await fetch(`https://queue-times.com/fr/parks/${id}/queue_times.json`, {
    mode: 'no-cors',
    crossDomain:true,
  });

  console.log(response)
  return response.json();
};

export {
  getQueueTimes
}
