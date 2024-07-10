import React, { useState, useRef, useEffect } from "react";
import styles from "./SendInvite.module.css";
import classNames from "classnames";
import { axiosInstance } from "../AxiosInterceptor/AxiosInterceptor";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/reducers";
import { closeSendInvite } from "../Redux/slice/deal/dealFormSlice";
import { AppDispatch } from "../Redux/store";
import {
  fetchRoles,
  selectRolesLoading,
  selectRolesError,
} from "../Redux/slice/role/rolesSlice";

interface SendInviteProps {
  onCloseDialog: () => void;
}

const SendInvite: React.FC<SendInviteProps> = ({ onCloseDialog }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const open = useSelector((state: RootState) => state.sendInviteReducer.open);
  const roles = useSelector((state: RootState) => state.roles.roles);
  const rolesLoading = useSelector(selectRolesLoading);
  const rolesError = useSelector(selectRolesError);
  const [showInviteForm, setShowInviteForm] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roleId, setRoleId] = useState<number | null>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    console.log("Roles in send invite:", roles);
  }, [roles]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();

        if (roleId === null) {
            setResponseMessage('Please select the role.');
            setResponseType('error');
            return;
        }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/auth/invite", {
        email,
        roleId,
      });
      const data = response.data;
      if (data) {
        setResponseMessage(data.message);
        setResponseType("success");
        setTimeout(() => {
          dispatch(closeSendInvite());
          setShowInviteForm(false);
          setEmail("");
          setResponseType("");
          navigate("/dashboard");
          onCloseDialog();
        }, 3000);
      } else {
        setResponseMessage(data.message || "Failed to send invite.");
        setResponseType("error");
      }
    } catch (error: any) {
      setResponseMessage(
        error.response.data.message || "An error occurred. Please try again."
      );
      setResponseType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {open && showInviteForm && (
        <div className={styles.formContainer}>
          <h2>Send Invite</h2>
          {responseMessage && (
            <div
              className={classNames(styles.responseMessage, {
                [styles.success]: responseType === "success",
                [styles.error]: responseType === "error",
              })}
            >
              {responseMessage}
            </div>
          )}

          <form onSubmit={handleSendInvite}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="roleId">Role:</label>
              <div className={styles.selectWrapper}>
                <select
                  id="roleId"
                  name="roleId"
                  ref={selectRef}
                  className={styles.customSelect}
                  value={roleId ?? ""}
                  onChange={(e) => setRoleId(Number(e.target.value))}
                  required
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" disabled={isLoading || rolesLoading}>
              {isLoading ? "Sending Invite" : "Send Invite"}
            </button>
          </form>
          {(isLoading || rolesLoading) && (
            <div className={styles.loaderContainer}>
              <div className={styles.loader}></div>
            </div>
          )}
          {rolesError && (
            <div className={styles.error}>
              Error loading roles: {rolesError}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SendInvite;
