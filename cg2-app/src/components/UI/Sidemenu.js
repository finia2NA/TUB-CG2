import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";

const Sidemenu = () => {

  const [sliderValue, setSliderValue] = useState(50);
  const [dropdownValue, setDropdownValue] = useState('knn');

  const handleSliderChange = (e) => {
    setSliderValue(e.target.value);
  };


  return (
    <>
      {/* TODO make this prettier */}
      <div style={{ display: "flex", flexDirection: "column", margin: "16px 16px 80px" }}>
        <h1>Side menu</h1>
        This doesn't do anything yet.
      </div>
      <div className="container">
        <Row>
          <Col>
            <Form.Group controlId="formDropdown">
              <Form.Label>Gather Method</Form.Label>
              <div>
                <Form.Select onChange={(e) => setDropdownValue(e.target.value)}>
                  <Form.Label value={dropdownValue}>gather method</Form.Label>
                  <option value="knn">K-nearest-neighbour</option>
                  <option value="radius">Radius</option>
                </Form.Select>
              </div>
            </Form.Group>
            <Form.Group controlId="formSlider">
              <Form.Label>Value</Form.Label>
              <div>
                <Form.Range min="0" max="100" value={sliderValue} onChange={handleSliderChange} />
              </div>
            </Form.Group>
          </Col>
        </Row>
      </div >
    </>
  );
}

export default Sidemenu;