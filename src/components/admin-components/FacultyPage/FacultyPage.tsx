import React, { useEffect, useState } from "react";
import "./FacultyPage.scss";
import delete_icon from "../../../svg/delete_sweep_24px_outlined.svg";
import Modal from "../../Modal";
import { AddFacultyWindow, AddDepartmentWindow } from "./ModalWindow";
import {
  getFaculty,
  createFaculty,
  deleteFaculty,
  deleteDepartment,
  createDepartment,
} from "../../../redux/actions/AdministratorActions";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import Preloader from "../../Preloader";
import { department } from "../../model/student";
import {
  facultyAlphabeticalSortFn,
  departmentAlphabeticalSortFn,
} from "../common/sortHelperFn";

const FacultyPage = ({
  faculty,
  department,
  loading,
  getFaculty,
  createFaculty,
  createDepartment,
  ...props
}: any) => {
  const [modalData, setModalData] = useState({
    show: false,
    display: <></>,
  });

  useEffect(() => {
    if (Object.values(faculty).length < 1) {
      (async () => {
        try {
          await getFaculty();
        } catch (error) {
          toast.error(`Error: ${error.message}`, { position: "top-center" });
        }
      })();
    }
  }, [faculty, getFaculty]);

  useEffect(() => {
    let acc = document.querySelectorAll(".faculty__accordion");
    let i: number;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function (this: any) {
        /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
        this.classList.toggle("faculty__active");

        /* Toggle between hiding and showing the active panel */
        let panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
          panel.style.marginBottom = "0";
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
          panel.style.marginBottom = "1rem";
        }
      });
    }
  }, [faculty, department]);

  const handleModalClose = () => setModalData({ ...modalData, show: false });

  const onClickShowAddFacultyModal = () => {
    setModalData({
      show: true,
      display: (
        <AddFacultyWindow
          handleModalClose={handleModalClose}
          createFaculty={createFaculty}
          faculty={faculty}
        />
      ),
    });
  };

  const onClickShowAddDepartmentModal = (faculty: string) => {
    setModalData({
      show: true,
      display: (
        <AddDepartmentWindow
          handleModalClose={handleModalClose}
          faculty={faculty}
          createDepartment={createDepartment}
        />
      ),
    });
  };
  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <>
          <Modal show={modalData.show} handleClose={handleModalClose}>
            {modalData.display}
          </Modal>
          <section className="faculty">
            <div className=" d-flex justify-content-between align-items-center faculty__header">
              <h2 className="faculty__title">Faculties &amp; Departments</h2>
              <button
                className="btn btn-primary faculty__add-btn"
                onClick={onClickShowAddFacultyModal}
              >
                Add Faculty
              </button>
            </div>
            {Object.values(faculty)
              .sort(facultyAlphabeticalSortFn)
              .map((faculty: any, index: number) => {
                return (
                  <Faculty
                    faculty={faculty}
                    onClickShowAddDepartmentModal={
                      onClickShowAddDepartmentModal
                    }
                    onDepartmentDelete={props.deleteDepartment}
                    onDeleteClick={async (id) => {
                      try {
                        await props.deleteFaculty(id);
                      } catch (error) {
                        getFaculty();
                        throw error;
                      }
                    }}
                    key={index}
                  />
                );
              })}
          </section>
        </>
      )}
    </>
  );
};

const Faculty = ({
  faculty,
  onClickShowAddDepartmentModal,
  onDeleteClick,
  onDepartmentDelete,
}: {
  faculty: any;
  onClickShowAddDepartmentModal: (faculty: string) => void;
  onDeleteClick: (id: string) => Promise<any>;
  onDepartmentDelete: (department: string, faculty: string) => Promise<any>;
}) => {
  const departments = faculty.departments;

  return (
    <>
      <div className="d-flex align-items-center btn faculty__accordion">
        <div className="d-flex flex-column">
          {faculty.faculty}{" "}
          <span className="faculty__accordion-info">
            {departments.length > 0 ? (
              <>
                {departments.length > 1
                  ? `${departments.length} departments`
                  : `${departments.length} department`}{" "}
              </>
            ) : (
              "No Assigned department"
            )}
          </span>
        </div>

        <div className="d-flex ml-auto">
          <button
            className="mr-4 btn btn-light faculty__btn"
            onClick={() => onClickShowAddDepartmentModal(faculty)}
          >
            +
          </button>{" "}
          <button
            onClick={async () => {
              try {
                await onDeleteClick(faculty._id);
                toast.success("Faculty deleted",{
        position: "top-center"
      });
              } catch (error) {
                toast.error(error.message, { position: "top-center" });
              }
            }}
            className="btn btn-light faculty__btn"
          >
            <img src={delete_icon} alt="delete icon" />
          </button>
        </div>
      </div>

      <div className="faculty__department-panel">
        <h3 className="faculty__title">Departments</h3>
        {departments
          .sort(departmentAlphabeticalSortFn)
          .map((dept: any, index: number) => (
            <span
              className="d-flex align-items-center"
              key={`department_${index}`}
            >
              {dept.department}
              <button
                onClick={async () => {
                  try {
                    await onDepartmentDelete(dept._id, faculty._id);
                    toast.success("Department deleted",{
                      position: "top-center"
                    });
                  } catch (error) {
                    toast.error(error.message, { position: "top-center" });
                  }
                }}
                className="btn btn-light ml-auto faculty__btn"
              >
                <img src={delete_icon} alt="delete icon" />
              </button>
            </span>
          ))}
      </div>
    </>
  );
};

function mapStateToProps(state: any) {
  return {
    faculty: state.faculty,
    department: state.department,
    loading: state.apiCallsInProgress > 0,
  };
}

const mapDispatchToProps = {
  getFaculty,
  createFaculty,
  deleteFaculty,
  createDepartment,
  deleteDepartment,
};

export default connect(mapStateToProps, mapDispatchToProps)(FacultyPage);
