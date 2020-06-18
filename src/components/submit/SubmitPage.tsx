import React, { useState, useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";

import "./SubmitPage.scss";

const SubmitPage = (props: { deleteStudent: () => Promise<any> }) => {
  // const history = useHistory();
  const [redirectState, setRedirectState] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      delete localStorage["jwt"];
      delete localStorage["route"];
      window.location.reload();
      setRedirectState(true);
    }, 5000);

    return () => clearTimeout(id);
  });

  return redirectState ? (
    <Redirect to="/" />
  ) : (
    <section className="m-auto submit">
      <div>
        <h3>
          Course - <span>Nigeria People and Culture (GST 103)</span>
        </h3>
      </div>
      <div className="d-flex flex-column mb-5 text-center submit">
        <p>
          Exam Submitted succesfully, Please Leave the Exam hall if you just
          Submitted <br />
          If this does not automatically redirect you to the Login Page
        </p>

        <div className="text-center">
          <button
            className="btn"
            onClick={() => {
              delete localStorage["jwt"];
              delete localStorage["route"];
              window.location.reload();
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
