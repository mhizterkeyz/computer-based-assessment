import React, { useEffect, useState } from "react";
import { loadUpExams } from "../../../redux/actions/AdministratorActions";
import { connect } from "react-redux";
import Assessment from "../common/Assessment";
import { toast } from "react-toastify";
import Preloader from "../../Preloader";

const RunningAssessment = (props: any) => {
  const { exams, loadUpExams } = props;
  const [examsLoaded, setExamLoaded] = useState(false);

  useEffect(() => {
    if (!examsLoaded) {
      (async () => {
        try {
          await loadUpExams();
          setExamLoaded(true);
        } catch (error) {
          toast.error(`Error: ${error.message}`, { position: "top-center" });
        }
      })();
    }
  }, [exams, loadUpExams, examsLoaded]);

  let runningExam: any;
  if (!props.loading) {
    runningExam = Object.values(props.exams).filter(
      (exam: any) => exam.status === 1
    );
  }

  return (
    <>
      {props.loading ? (
        <Preloader />
      ) : (
        <>
          {runningExam.length === 0 ? (
            <div className="text-center mt-5 no-running-exam">
              There are no running examinations at this time{" "}
            </div>
          ) : (
            // <div>examinations running </div>
            runningExam.map((exam: any, index: number) => {
              return (
                <Assessment
                  exam={exam}
                  key={index}
                  match={{ params: { id: exam._id } }}
                  location={props.location}
                />
              );
            })
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
  loadUpExams,
};

export default connect(mapStateToProps, mapDispatchToProps)(RunningAssessment);
