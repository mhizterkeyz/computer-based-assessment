import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import "./CredentialsPage.scss";

interface CredentialsProps {
  name: string;
  matric_no: string;
  department: any;
  faculty: any;
}

const Credentials = ({ detail, data }: { detail: string; data: string }) => {
  return (
    <div>
      <h4>{detail}:</h4>
      <h5>{data}</h5>
    </div>
  );
};

const CredentialsPage = ({
  name,
  matric_no,
  department,
  faculty,
}: CredentialsProps) => {
  const history = useHistory();
  const [redirectState, setRedirectState] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setRedirectState(true);
    }, 100000);

    return () => clearTimeout(id);
  });

  return redirectState ? (
    <Redirect to="/exam/instruction" />
  ) : (
    <section className="m-auto credentials">
      <div className="d-flex flex-column mb-5">
        <h3>Welcome, {name} !</h3>
        <div className="row d-flex flex-column justify-content-center align-items-center">
          <div className="mr-5 mb-3">
            <img
              src={
                `http://${window.location.hostname}:8000/api/static/` +
                matric_no +
                ".png"
              }
              alt="student avatar"
              style={{ maxWidth: "100%", borderRadius: "50%" }}
            />
          </div>
          <div className="details">
            <Credentials detail="Matric. no" data={matric_no} />
            <Credentials detail="Department" data={department.department} />
            <Credentials detail="Faculty" data={faculty.faculty} />
          </div>
        </div>
        <p>
          Confirm this Information to be your Information and <br /> Click on
          the proceed button.
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
