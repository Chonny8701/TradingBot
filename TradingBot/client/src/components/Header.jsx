import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../images/logo.png'
import '../scss/components/Header.scss'

const Header = () => {

  return (
    <Navbar expand="lg" className="barra-navegacion bg-body-tertiary"  style={{ fontSize: "18px"}}>
      <Container>
        <Navbar.Brand href="/"><img src={logo} id="header-logo" className="img-fluid rounded-start logo-image" alt="Imagen del logo" width={"40px"} height={"40px"}/></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" >
            <Nav.Link href="/" >Mercados</Nav.Link>
            <Nav.Link href="/grafica_velas"  >Graficas</Nav.Link>
            <Nav.Link href="/trading_bot" >Trading Bot</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;