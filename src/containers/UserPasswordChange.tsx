import React, { useState, FormEvent } from "react";
import { Container, Box, TextField, Button, Typography } from "@material-ui/core";
import { withRouter } from "react-router";
import apis from "../apis";

export default withRouter(function UserPasswordChange({ history }) {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>("");

  const [currentPasswordError, setCurrentPasswordError] = useState<string>("");
  const [newPasswordError, setNewPasswordError] = useState<string>("");
  const [newPasswordConfirmError, setNewPasswordConfirmError] = useState<string>("");

  const [waiting, setWaiting] = useState<boolean>(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    let errorOccured = false;
    if (!currentPassword) {
      setCurrentPasswordError("현재 비밀번호를 입력하세요.");
      errorOccured = true;
    }
    if (!newPassword) {
      setNewPasswordError("새로운 비밀번호를 입력하세요.");
      errorOccured = true;
    }

    if (newPassword && newPassword !== newPasswordConfirm) {
      setNewPasswordConfirmError("새로운 비밀번호가 일치하지 않습니다.");
      errorOccured = true;
    }

    if (currentPasswordError || newPasswordError) {
      return;
    }

    if (!errorOccured) {
      setWaiting(true);
      apis
        .changeUserPassword(currentPassword, newPassword)
        .then((response) => {
          window.alert("비밀번호를 변경했습니다.");
          setWaiting(false);
          history.push("/");
          setWaiting(false);
        })
        .catch((error) => {
          let errMessage = error?.response?.data?.message || "비밀번호 변경에 실패했습니다.";
          if (errMessage === "No message available") {
            errMessage = "비밀번호 변경에 실패했습니다.";
          }
          window.alert(errMessage);
          setWaiting(false);
        });
    }
  };
  return (
    <Container className="user-password-change-page" maxWidth="md">
      <Box className="box">
        <Typography variant="h3" component="h3" style={{ marginBottom: "1em" }}>
          비밀번호 변경
        </Typography>
        <form onSubmit={onSubmit}>
          <TextField
            type="password"
            error={!!currentPasswordError}
            helperText={currentPasswordError}
            variant="outlined"
            label="현재 비밀번호"
            margin="normal"
            fullWidth
            value={currentPassword}
            onChange={(e) => {
              setCurrentPasswordError("");
              setCurrentPassword(e.target.value);
            }}
          />
          <TextField
            type="password"
            error={!!newPasswordError}
            helperText={newPasswordError}
            variant="outlined"
            label="새로운 비밀번호"
            margin="normal"
            fullWidth
            value={newPassword}
            style={{ marginBottom: "1em" }}
            onChange={(e) => {
              setNewPasswordError("");
              setNewPassword(e.target.value);
            }}
          />
          <ul>
            <li>최소한 8글자 이상이어야 합니다.</li>
            <li>소문자를 적어도 하나 이상 포합시켜야 합니다.</li>
            <li>대문자를 적어도 하나 이상 포합시켜야 합니다.</li>
            <li>특수문자를 적어도 하나 이상 포함시켜야 합니다.</li>
            <li>숫자를 적어도 하나 이상 포함시켜야 합니다.</li>
          </ul>
          <TextField
            type="password"
            error={!!newPasswordConfirmError}
            helperText={newPasswordConfirmError}
            variant="outlined"
            label="새로운 비밀번호 확인"
            margin="normal"
            fullWidth
            value={newPasswordConfirm}
            style={{ marginBottom: "1em" }}
            onChange={(e) => {
              setNewPasswordConfirmError("");
              setNewPasswordConfirm(e.target.value);
            }}
          />
          <ul>
            <li>새로운 비밀번호 확인은 비밀번호와 일치해야 합니다.</li>
          </ul>
          <Button type="submit" variant="contained" color={currentPassword && newPassword ? "primary" : "default"} fullWidth size="large" disabled={waiting}>
            변경
          </Button>
        </form>
      </Box>
    </Container>
  );
});
