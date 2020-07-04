import React from "react";

const StudentCred = ({
  Preloader,
  display_img,
  minutes,
  loading,
  timer_icon,
  seconds,
  ...props
}: any) => {
  return (
    <section className="col-2 mr-3 student-credentials">
      {loading ? (
        <Preloader />
      ) : (
        <>
          <div className="text-center">
            <span className="image-cropper">
              <object
                data={
                  `http://${window.location.hostname}:8000/api/static/` +
                  props.matric +
                  ".png"
                }
                type="image/jpg"
              >
                <img
                  src={`http://${window.location.hostname}:8000/api/static/default.png`}
                  alt="student"
                />
              </object>
            </span>
            <h2>{props.name}</h2>
          </div>

          <hr />

          <div className="details">
            <div>
              <h3>Matric. no:</h3>
              <h4>{props.matric}</h4>
            </div>

            <div>
              <h3>Department</h3>
              <h4>{props.department.department}</h4>
            </div>
            <div>
              <h3>Faculty</h3>
              <h4>{props.faculty.faculty}</h4>
            </div>
          </div>

          <div
            className="d-flex justify-content-center align-items-center mt-3"
            style={minutes <= 9 ? { color: "red" } : { color: "" }}
          >
            <img src={timer_icon} alt="timer icon" className="mr-2" />
            <h5>
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </h5>
          </div>
        </>
      )}
    </section>
  );
};

export default StudentCred;
