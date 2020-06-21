import React from "react";
import {
  TextField,
  NumberField,
  EmailField,
  PasswordField,
} from "./InputField";

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
  handleInputs,
  handleUpdate,
  errors = {},
}: any) => {
  // const history = useHistory();
  return (
    <div className="text-center profile">
      <h3>Create New Admin </h3>
      <form onSubmit={handleUpdate}>
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

        <EmailField name="email" label="Email" placeholder="Enter Email here" handleInputs={handleInputs} />

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

export const GeneratePinModalWindow = ({ handleModalClose }: any) => {
  // const history = useHistory();
  return (
    <div className="text-center profile">
      <h3>Specify Number of PIN</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <NumberField label="How many PIN?" name="pin" />

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
            Generate
          </button>
        </div>
      </form>
    </div>
  );
};
