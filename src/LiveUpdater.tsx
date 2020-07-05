import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { verifyStudent } from "./redux/actions/studentAction";

const LiveUpdater = ({ verifyStudent }: any) => {
  const [timer, setTimer] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await verifyStudent();
      } catch (error) {
        // Live updates failed, do nothing
      }
    })();
    const inte = setInterval(() => setTimer(!timer), 5000);
    return () => clearInterval(inte);
  }, [timer, verifyStudent]);
  return <></>;
};

export default connect(null, { verifyStudent })(LiveUpdater);
