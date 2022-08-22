import {useEffect, useState} from "react";
import {getQueueTimes} from "../../Services/QueueTimes";
import Lands from "../Lands/Lands";
import "./WaitingTimes.css";

const fiveMinutes = 1000 * 60 * 5;

const getParksLandData = async () => {
  const mainPark = await getQueueTimes(4);
  const secondPark = await getQueueTimes(28);

  return [...mainPark.lands, ...secondPark.lands];
}

const getLands = async (setLands) => {
  const landsData = await getParksLandData();

  setLands(landsData.map(land => {
    return <Lands key={land.id} name={land.name} rides={land.rides}/>
  }));

}


const WaitingTimes = () => {
  const [lands, setLands] = useState([]);

  useEffect(() => {

    const interval = setInterval(() => getLands(setLands), fiveMinutes);
    getLands(setLands);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div className="preload">
        {/*<div>*/}
        {/*  <button>Favoris</button>*/}
        {/*</div>*/}
        {lands}
      </div>
    </div>
  )
}

export default WaitingTimes;
