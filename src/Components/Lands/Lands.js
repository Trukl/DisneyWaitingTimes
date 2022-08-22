import Attraction from "../Attraction/Attraction";
import Container from 'react-bootstrap/Container';
import {Row} from "react-bootstrap";

const Lands = (props) => {
  const {name, rides} = props;

  const attractions = rides.map(attraction => {
    return <Attraction key={attraction.id} name={attraction.name} waitingTime={attraction.wait_time} isOpen={attraction.is_open}/>
  });
  return (
    <div>
      <h1>{name}</h1>
      <Container fluid>
        <Row className="p-4">
        {attractions}
        </Row>
      </Container>
    </div>
  )
}

export default Lands;
