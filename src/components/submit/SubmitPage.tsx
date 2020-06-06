import React, { useState, useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import "./SubmitPage.scss";

const SubmitPage = () => {
  const history = useHistory();
  const [redirectState, setRedirectState] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setRedirectState(true);
    }, 7000);

    return () => clearTimeout(id);
  });

  return redirectState ? (
    <Redirect to="/exam/instruction" />
  ) : (
    <section className="m-auto submit">
      <div>
        <h3>
          Course - <span>NIGERIAN PEOPLE and culture (GST 103)</span>
        </h3>
      </div>
      <div className="d-flex flex-column mb-5 submit">
        <p>
          Exam Submitted succesfully, Please Leave the Exam hall if you just
          Submitted <br />
          If this does not automatically redirect you to the Login Page
        </p>

        <div className="text-center">
          <button
            className="btn"
            onClick={() => {
              history.push("/student-login");
            }}
          >
            Click Here
          </button>
        </div>
      </div>
    </section>
  );
};

export default SubmitPage;
