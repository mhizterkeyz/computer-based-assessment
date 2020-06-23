import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  TextField,
  NumberField,
  EmailField,
  PasswordField,
} from "./InputField";
import { useHistory } from "react-router-dom";

export const UpdateProfileModalWindow = ({
  handleModalClose,
  profile,
  handleInputs,
  handleUpdate,
  errors = {},
}: any) => {
  // const history = useHistory();
  return (
    <div className="text-center profile">
      <h3>Update profile</h3>
      <form onSubmit={handleUpdate}>
        {errors.onSaveError && (
          <div className="alert alert-danger" role="alert">
            {errors.onSaveError}
          </div>
        )}
        <TextField
          name="name"
          label="Name"
          value={profile.name}
          placeholder=""
          handleInputs={handleInputs}
        />

        <TextField
          name="username"
          label="Username"
          value={profile.username}
          placeholder=""
          handleInputs={handleInputs}
        />

        <EmailField
          name="email"
          label="Email"
          value={profile.email}
          placeholder=""
          handleInputs={handleInputs}
        />

        {errors.onPasswordMismatch && (
          <div className="alert alert-danger" role="alert">
            {errors.onPasswordMismatch}
          </div>
        )}
        <div className="row mb-4">
          <PasswordField
            class="col-6"
            name="password"
            label="Password"
            placeholder="New password"
            handleInputs={handleInputs}
          />

          <PasswordField
            class="col-6"
            name="cpassword"
            label="Confirm password"
            placeholder="Confirm password"
            handleInputs={handleInputs}
          />
        </div>

        <div className="">
          <button className="btn btn-primary" onClick={handleModalClose}>
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary ml-2"
            onClick={() => {
              // history.push("/exam/submit");
            }}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export const AddAdminModalWindow = ({
  handleModalClose,
  createAdministrator,
  errors = {},
}: any) => {
  const history = useHistory();
  const [input, setInput] = useState({});

  const handleInputs = (ev: any) => {
    const { name, value } = ev.target;
    setInput({ ...input, [name]: value });
  };
  return (
    <div className="text-center profile">
      <h3>Create New Admin </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          (async () => {
            try {
              await createAdministrator(input);
              toast.configure();
              toast.success("Admin Successfully Created");
              setTimeout(() => {
                window.location.reload();
              }, 500);
            } catch (error) {
              toast.configure();
              toast.error(error.message);
            }
          })();
        }}
      >
        {errors.onSaveError && (
          <div className="alert alert-danger" role="alert">
            {errors.onSaveError}
          </div>
        )}
        <TextField
          name="name"
          label="Name"
          placeholder="Enter Name here"
          handleInputs={handleInputs}
        />

        <TextField
          name="username"
          label="Username"
          placeholder="Enter Username here"
          handleInputs={handleInputs}
        />

        <EmailField
          name="email"
          label="Email"
          placeholder="Enter Email here"
          handleInputs={handleInputs}
        />

        <PasswordField
          class=""
          name="password"
          label="Password"
          placeholder="Enter Password here"
          handleInputs={handleInputs}
        />

        <div className="">
          <button className="btn btn-primary" onClick={handleModalClose}>
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary ml-2"
            onClick={() => {
              // history.push("/exam/submit");
            }}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export const GeneratePinModalWindow = ({
  handleModalClose,
  createPin,
}: any) => {
  const history = useHistory();
  const [input, setInput] = useState({ count: "" });

  const handleInputs = (ev: any) => {
    const { name, value } = ev.target;
    setInput({ ...input, [name]: value });
  };
  return (
    <div className="text-center profile">
      <h3>Specify Number of PIN</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          (async () => {
            try {
              const count = parseInt(input.count);
              await createPin({ count });
              toast.configure();
              toast.success("Pin Successfully Created");
              setTimeout(() => {
                history.push("/admin/print-pin");
              }, 500);
            } catch (error) {
              toast.configure();
              toast.error(error.message);
            }
          })();
        }}
      >
        <NumberField
          label="How many PIN?"
          name="count"
          handleInputs={handleInputs}
        />

        <div className="">
          <button className="btn btn-primary" onClick={handleModalClose}>
            Cancel
          </button>

          <button type="submit" className="btn btn-primary ml-2">
            Generate
          </button>
        </div>
      </form>
    </div>
  );
};
