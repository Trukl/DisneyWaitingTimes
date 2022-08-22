import './Attraction.css'
import {Col} from "react-bootstrap";

const getDurationClass = (time) => {
  if (time < 30) {
    return 'Green';
  } else if (time < 60) {
    return 'Orange';
  }
  return 'Red';
}

const Attraction = (props) => {
  const {name, waitingTime, isOpen} = props;
  //
  return (
    <Col lg={4} s={1} xs={12} md={6} className={`mb-2 p-2`} >
      <div className={`Attraction ${getDurationClass(waitingTime)} ${isOpen ? '' : 'Closed'}`}>
        <div className={'FlexNormal'}>
          <div className={'WaitingTime'}>{waitingTime}</div>
          <div className={'Name'}>{name}</div>
        </div>
        {!isOpen ? <span className={'IsClosed'}>Fermé </span> : ''}
      </div>

    </Col>
  )
}

export default Attraction;
