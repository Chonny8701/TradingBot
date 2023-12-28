import CriptoPrecioFecha from './CriptoPrecioFecha';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../scss/components/CriptoInfo.scss'

const CriptoInfo = ({ url_images, nombre }) => {
  return (
    <Card style={{ width: '400px' }} className='cripto_info-container'>
      <Row>
        <Col xs={4} className='d-flex justify-content-center' >
          <Card.Img src={url_images}style={{padding: '10px 0 10px 10px'}} />
        </Col>
        <Col xs={8}>
          <Card.Body>
            <Card.Title>{nombre}</Card.Title>
            <CriptoPrecioFecha nombre = {nombre } />
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default CriptoInfo;