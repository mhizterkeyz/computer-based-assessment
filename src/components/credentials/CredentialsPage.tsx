import React from 'react';
import { useHistory } from 'react-router-dom';
import './CredentialsPage.scss';
import display_img from '../../image/Rectangle-19.png';

const CredentialsPage = () => {
  const history = useHistory();

  return (
    <section className="m-auto credentials">
      <div className="d-flex flex-column mb-5">
        <h3>Welcome Alikali Ojonugwa Justice !</h3>
        <div className="row d-flex justify-content-center align-items-center">
          <div className="mr-5"><img src={display_img} alt="ojay" /></div>
          <div className="details">
            <div>
              <h4>Matric. no:</h4>
              <h5>13ms1023</h5>
            </div>

            <div>
              <h4>Department:</h4>
              <h5>Computer Science</h5>
            </div>

            <div>
              <h4>Faculty:</h4>
              <h5>Natural Science</h5>
            </div>
          </div>
        </div>

        <p>If this page does not Auotmatically redirect you. <br /> Click on the proceed button.</p>

        <div className="text-center">
          <button className="btn" onClick={() => { history.push("/exam/instruction"); }}>Proceed</button>
        </div>
      </div>
    </section>
  );
};

export default CredentialsPage;