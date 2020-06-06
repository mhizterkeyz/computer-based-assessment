import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import "./CredentialsPage.scss";
import display_img from "../../image/Rectangle-19.png";

const credentialsObj = {
  displayImg: display_img,
};

interface CredentialsProps {
  displayImg: string;
  user: {
    name: string;
    matric: string;
    department: string;
    faculty: string;
  };
}

const Credentials = (props: CredentialsProps) => {
  return (
    <>
      <h3>Welcome {props.user.name} !</h3>
      <div className="row d-flex justify-content-center align-items-center">
        <div className="mr-5">
          <img src={props.displayImg} alt="ojay" />
        </div>
        <div className="details">
          <div>
            <h4>Matric. no:</h4>
            <h5>{props.user.matric}</h5>
          </div>

          <div>
            <h4>Department:</h4>
            <h5>{props.user.department}</h5>
          </div>

          <div>
            <h4>Faculty:</h4>
            <h5>{props.user.faculty}</h5>
          </div>
        </div>
      </div>
    </>
  );
};

const CredentialsPage = (props: any) => {
  const history = useHistory();
  const [redirectState, setRedirectState] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setRedirectState(true);
    }, 5000);

    return () => clearTimeout(id);
  });

  return redirectState ? (
    <Redirect to="/exam/instruction" />
  ) : (
    <section className="m-auto credentials">
      <div className="d-flex flex-column mb-5">
        <Credentials {...credentialsObj} user={props.user} />

        <p>
          If this page does not Auotmatically redirect you. <br /> Click on the
          proceed button.
        </p>

        <div className="text-center">
          <button
            className="btn"
            onClick={() => {
              history.push("/exam/instruction");
            }}
          >
            Proceed
          </button>
        </div>
      </div>
    </section>
  );
};

export default CredentialsPage;
