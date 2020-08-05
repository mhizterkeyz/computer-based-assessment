import React from "react";
// import Developer_SVG from "../../../svg/undraw_developer_activity.svg";
import Header from "../../Header";

const ContactDeveloperPage = () => {
  return (
    <>
      <Header />
      <section
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: " translate(-50%, -50%)",
        }}
      >
        <div className="text-center">
          {/* <img src={Developer_SVG} alt="assesment" /> */}

          <h2 style={{ margin: "0 0 20px", fontSize: 45 }}>
            Contact the Developers
          </h2>
          <h3
            style={{
              fontWeight: 600,
              fontSize: 22,
              color: "#504F60",
            }}
          >
            +2347063341844, +2348162452124
          </h3>
        </div>
      </section>
    </>
  );
};

export default ContactDeveloperPage;
