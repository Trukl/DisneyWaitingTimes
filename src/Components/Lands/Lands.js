import Attraction from "../Attraction/Attraction";
import Container from 'react-bootstrap/Container';
import {Row} from "react-bootstrap";
import "./Lands.css";

const Name = ({name, parkId}) => {
  if (name) {
    return (
      <div className={'land-name'}>
        <h1>{name}</h1>
        {parkId === 0 ? 'Parc DisneyLand' : 'Parc Walt Disney Studios'}
      </div>
    )
  }
}

const Lands = (props) => {
  const {name, rides, parkId, favoriteHandle} = props;

  const attractions = rides.map(attraction => {
    return <Attraction key={attraction.id} data={attraction} favoriteHandle={favoriteHandle} />
  });
  return (
    <div>
      <Name name={name} parkId={parkId} />
      <Container fluid>
        <Row className="ps-4 pe-4">
          {attractions}
        </Row>
      </Container>
    </div>
  )
}

export default Lands;
