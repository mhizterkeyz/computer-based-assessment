import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  getFaculty,
  getAdministrators,
  loadPin,
  loadUpExams,
  VerifyAdministrator,
} from "../../../redux/actions/AdministratorActions";

const LiveUpdater = ({
  VerifyAdministrator,
  loadUpExams,
  loadPin,
  getAdministrators,
  getFaculty,
}: any) => {
  const [timer, setTimer] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        await VerifyAdministrator(true);
        await loadUpExams(true);
        await loadPin(true);
        await getAdministrators(true);
        await getFaculty(true);
      } catch (error) {
        // Live updates failed, do nothing
      }
    })();
    const inte = setInterval(() => setTimer(!timer), 5000);
    return () => clearInterval(inte);
  }, [
    timer,
    VerifyAdministrator,
    loadUpExams,
    loadPin,
    getAdministrators,
    getFaculty,
  ]);
  return <></>;
};

export default connect(null, {
  VerifyAdministrator,
  loadUpExams,
  loadPin,
  getAdministrators,
  getFaculty,
})(LiveUpdater);
