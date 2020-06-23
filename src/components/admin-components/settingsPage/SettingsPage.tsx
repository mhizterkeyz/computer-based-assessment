import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import delete_icon from "../../../svg/delete_sweep_24px_outlined.svg";
import Modal from "../../Modal";
import {
  createPin,
  getAdministrators,
  createAdministrator,
  deleteAdministrator,
} from "../../../redux/actions/AdministratorActions";
import {
  UpdateProfileModalWindow,
  GeneratePinModalWindow,
  AddAdminModalWindow,
} from "./ModalWindow";
import { toast } from "react-toastify";

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

const Admin = ({ name, username, email, deleteAdministrator, _id }: any) => {
  return (
    <div className="dta-body">
      <span className="">{name}</span>
      <span className="">{username}</span>
      <span className="">{email}</span>
      <button
        onClick={async () => {
          try {
            await deleteAdministrator(_id);
            toast.configure();
            toast.success(`${name} deleted successfully`);
            setTimeout(() => {
              window.location.reload();
            }, 500);
          } catch (error) {
            toast.configure();
            toast.error(error.message);
          }
        }}
      >
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
    password: "",
    cpassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleProfileInputs = (ev: any) => {
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
  };

  useEffect(() => {
    (async () => {
      try {
        await props.getAdministrators();
      } catch (error) {
        setErrors({ ...errors, onSaveError: error.message });
      }
    })();
  }, []);

  const nonRootAdmin = Object.values(props.otherAdministrator).filter(
    (admin: any, index: number) => {
      return admin.isRootAdmin === false;
    }
  );

  const onClickShowProfileModal = () => {
    setModalData({
      show: true,
      display: (
        <UpdateProfileModalWindow
          profile={profile}
          handleModalClose={handleModalClose}
          errors={errors}
          handleInputs={handleProfileInputs}
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
          createAdministrator={props.createAdministrator}
        />
      ),
    });
  };

  const onClickShowPinModal = () => {
    setModalData({
      show: true,
      display: (
        <GeneratePinModalWindow
          handleModalClose={handleModalClose}
          createPin={props.createPin}
        />
      ),
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
          {nonRootAdmin.length === 0 ? (
            <div className="pt-3 admin-list__no-admin">There are no other administrator</div>
          ) : (
            <>
              {Object.values(nonRootAdmin).map((admin, index) => {
                return (
                  <Admin
                    key={index}
                    {...admin}
                    deleteAdministrator={props.deleteAdministrator}
                  />
                );
              })}{" "}
            </>
          )}
        </div>
      </section>
    </>
  );
};

function mapStateToProps(state: any) {
  return {
    administrator: state.administrator,
    otherAdministrator: state.otherAdministrator,
  };
}

const mapDispatchToProps = {
  createPin,
  getAdministrators,
  createAdministrator,
  deleteAdministrator,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
