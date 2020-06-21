import React, { useState } from "react";
import { connect } from "react-redux";
import delete_icon from "../../../svg/delete_sweep_24px_outlined.svg";
import Modal from "../../Modal";
import {
  UpdateProfileModalWindow,
  GeneratePinModalWindow,
  AddAdminModalWindow,
} from "./ModalWindow";

const Button = ({ name, class: cssClass, onClickShowModal }: any) => {
  return (
    <button
      className={"btn btn-primary settings-btn " + cssClass}
      onClick={onClickShowModal}
    >
      {name.key} <br />
      <span>{name.value}</span>
    </button>
  );
};

const Admin = () => {
  return (
    <div className="dta-body">
      <span className="">Ojonugwa Alikali</span>
      <span className="">admin</span>
      <span className="">admin@mail.com</span>
      <button>
        <img src={delete_icon} alt="delete icon" />
      </button>
    </div>
  );
};

const SettingsPage = (props: any) => {
  const [modalData, setModalData] = useState({
    show: false,
    display: <></>,
  });

  const [profile, setProfile] = useState({
    ...props.administrator,
    password: "ndndndn",
    cpassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputs = (ev: any) => {
    const { name, value } = ev.target;
    setProfile((prevProfile: any) => ({ ...prevProfile, [name]: value }));
  };

  const handleModalClose = () => setModalData({ ...modalData, show: false });

  const handleUpdate = (event: any) => {
    event.preventDefault();
    // setSaving(true);
    let updatedProfile;
    if (profile.password !== profile.cpassword) {
      setErrors({
        ...errors,
        onPasswordMismatch: "Your password is not the same",
      });
    } else {
      updatedProfile = {
        name: profile.name,
        username: profile.username,
        email: profile.email,
        password: profile.password,
      };
    }

    // (async () => {
    //   try {
    //     // await updateAdministrator(updatedProfile)
    //     // toast.success("Profile updated.");
    //   } catch (error) {
    //     setErrors({ ...errors, onSaveError: error.message });
    //   }
    // })();
  };

  const onClickShowProfileModal = () => {
    setModalData({
      show: true,
      display: (
        <UpdateProfileModalWindow
          profile={profile}
          handleModalClose={handleModalClose}
          errors={errors}
          handleInputs={handleInputs}
          handleUpdate={handleUpdate}
        />
      ),
    });
  };

  const onClickShowAddAdminModal = () => {
    setModalData({
      show: true,
      display: (
        <AddAdminModalWindow
          handleModalClose={handleModalClose}
          errors={errors}
          handleInputs={handleInputs}
          handleUpdate={handleUpdate}
        />
      ),
    });
  };

  const onClickShowPinModal = () => {
    setModalData({
      show: true,
      display: <GeneratePinModalWindow handleModalClose={handleModalClose} />,
    });
  };

  return (
    <>
      <Modal show={modalData.show} handleClose={handleModalClose}>
        {modalData.display}
      </Modal>

      <section className="settings">
        <Button
          class="button1"
          name={{ key: "PIN", value: "Click to generate pin" }}
          onClickShowModal={onClickShowPinModal}
        />

        <Button
          class="button2"
          name={{ key: "PROFILE", value: "Click to update profile" }}
          onClickShowModal={() => onClickShowProfileModal()}
        />

        <div className="admin-list">
          <h3>View Admin</h3>
          <div className="d-flex">
            <div className="dta-head ">
              <span className="">Name</span>
              <span className="">Username</span>
              <span className="">Email</span>
            </div>
            <button
              className="btn btn-primary ml-3 add-admin"
              onClick={onClickShowAddAdminModal}
            >
              Add Admin
            </button>
          </div>

          <Admin />
          <Admin />
          <Admin />
          <Admin />
        </div>
      </section>
    </>
  );
};

function mapStateToProps(state: any) {
  return {
    administrator: state.administrator,
  };
}

// const mapDispatchToProps = {
//   updateAdministrator
// }

export default connect(mapStateToProps)(SettingsPage);
