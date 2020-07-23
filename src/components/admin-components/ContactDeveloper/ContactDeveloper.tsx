import React from "react";
import Developer_SVG from "../../../svg/undraw_developer_activity.svg";
import Header from "../../Header";

const ContactDeveloperPage = () => {
  return (
    <>
      <Header />
      <section className=" row m-auto  align-items-center login">
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <img src={Developer_SVG} alt="assesment" />

          <h2>Contact the develpers</h2>
          <h3
            style={{
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 600,
              fontSize: 25,
              lineHeight: 37,
              color: "#504F60",
            }}
          >
            +234 706 3341 844,
          </h3> 
        </div>
      </section>
    </>
  );
};

export default ContactDeveloperPage;
