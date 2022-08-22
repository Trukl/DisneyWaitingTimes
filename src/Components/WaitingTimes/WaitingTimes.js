import {useEffect, useState} from "react";
import {getQueueTimes} from "../../Services/QueueTimes";
import Lands from "../Lands/Lands";
import "./WaitingTimes.css";
const getParksLandData = async () => {
  const mainPark = await getQueueTimes(4);
  const secondPark = await getQueueTimes(28);

  return [...mainPark.lands, ...secondPark.lands];
}

const WaitingTimes = () => {
  const [lands, setLands] = useState([]);

  useEffect(() => {

    async function getLands() {
      const landsData = await getParksLandData();

      setLands(landsData.map(land => {
        return <Lands key={land.id} name={land.name} rides={land.rides}/>
      }));

    }

    const interval = setInterval(() => getLands(), 1000 * 60 * 5);
    getLands();
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div className="App-body">
        {lands}
      </div>
    </div>
  )
}

export default WaitingTimes;
