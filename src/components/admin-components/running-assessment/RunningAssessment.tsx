import React, { useEffect, useState } from "react";
import { loadSingleExam } from "../../../redux/actions/AdministratorActions";
import { connect } from "react-redux";
import Assessment from "../common/Assessment";
import { toast } from "react-toastify";
import Preloader from "../../Preloader";

const RunningAssessment = (props: any) => {
  const { exams, loadSingleExam } = props;
  const [activeChecked, setActiveChecked] = useState(false);

  useEffect(() => {
    if (!exams.activeFound && !activeChecked) {
      (async () => {
        try {
          await loadSingleExam("find?active=1");
          setActiveChecked(true);
        } catch (error) {
          toast.error(`Error: ${error.message}`, { position: "top-center" });
        }
      })();
    }
  }, [loadSingleExam, exams, activeChecked]);
  return (
    <>
      {props.loading ? (
        <Preloader />
      ) : (
        <>
          {!exams.activeFound ? (
            <div className="text-center mt-5 no-running-exam">
              There are no running examinations at this time{" "}
            </div>
          ) : (
            <Assessment
              match={{ params: { id: exams.activeId } }}
              location={props.location}
            />
          )}
        </>
      )}
    </>
  );
};

function mapStateToProps(state: any) {
  return {
    exams: state.exams,
    loading: state.apiCallsInProgress > 0,
  };
}

const mapDispatchToProps = {
  loadSingleExam,
};

export default connect(mapStateToProps, mapDispatchToProps)(RunningAssessment);
