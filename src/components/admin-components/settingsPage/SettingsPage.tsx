import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Modal from "../../Modal";
import {
  createPin,
  getAdministrators,
  createAdministrator,
  deleteAdministrator,
  updateAccount,
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
            toast.success(`${name} deleted successfully`, {
              position: "top-center",
            });
          } catch (error) {
            toast.error(error.message, { position: "top-center" });
          }
        }}
        className="btn btn-light faculty__btn"
      >
        <i className="icon-delete_forever" />
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
    setProfile({ ...profile, [name]: value });
  };

  const handleModalClose = () => setModalData({ ...modalData, show: false });

  const handleUpdate = async (profile: any, cb: any) => {
    let updatedProfile;
    if (profile.password.length > 0 && profile.password !== profile.cpassword) {
      if (cb) {
        cb({ onPasswordMismatch: "Your password is not the same" });
      }
    } else {
      updatedProfile = {
        name: profile.name,
        username: profile.username,
        email: profile.email,
        ...((profile.password.length > 0 && { password: profile.password }) ||
          {}),
      };
      try {
        return (
          (await props.updateAccount(updatedProfile)) &&
          toast.success("Account updated", {
            position: "top-center",
          })
        );
      } catch (error) {
        cb({ onSaveError: error.message });
      }
    }
  };

  const { getAdministrators } = props;

  useEffect(() => {
    let administratorUpdate = async () => {
      try {
        await getAdministrators(true);
      } catch (error) {
        //  Administrator update failed. do nothing.
      }
      setTimeout(administratorUpdate, 10000);
    };
    administratorUpdate();
    return () => {
      administratorUpdate = async () => {};
    };
  }, [getAdministrators]);

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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>View Admin</h3>
            {props.administrator.isRootAdmin ? (
              <button
                className="btn btn-primary ml-3 add-admin"
                onClick={onClickShowAddAdminModal}
              >
                Add Admin
              </button>
            ) : null}
          </div>
          <div className="dta-head ">
            <span>Name</span>
            <span>Username</span>
            <span>Email</span>
            <span></span>
          </div>
          {nonRootAdmin.length === 0 ? (
            <div className="pt-3 admin-list__no-admin">
              There are no other administrators
            </div>
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
  updateAccount,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
