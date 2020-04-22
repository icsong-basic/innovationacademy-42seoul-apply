import React, { useState, useEffect, FormEvent } from 'react';
import { withRouter, Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import userSingleton from '../stores/userSingleton'

import apis from '../apis';

const Logo = require("../assets/images/logo.png")

const useStyles = makeStyles(theme => ({
    layout: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    paper: {
        margin: theme.spacing(1),
        padding: theme.spacing(3),
        backgroundColor: 'rgba(255,255,255,0.1)',
        color: '#ffffff',
        borderRadius: theme.spacing(1)
    },
    title: {
        marginBottom: theme.spacing(5)
    },
    loginBtn: {
        marginTop: theme.spacing(1),
    },
    forgotPwBtn: {
        marginTop: theme.spacing(3),
    },
    alreadyRegistered: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    logo: {
        width: theme.spacing(30)
    }
}));


export default withRouter(function PasswordReset({ history, location, match }) {
    const classes = useStyles();
    const [password1, setPassword1] = useState<string>('')
    const [password2, setPassword2] = useState<string>('')
    const [password1ErrorMessage, setPassword1ErrorMessage] = useState<string>('')
    const [password2ErrorMessage, setPassword2ErrorMessage] = useState<string>('')
    const [resetBtnDisabled, setResetBtnDisabled] = useState(false)
    const token = (match && match.params && match.params.token) ? match.params.token : '';

    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        let errorOccured = false;
        if (!password1) {
            setPassword1ErrorMessage('비밀번호를 입력하세요.');
            errorOccured = true
        }
        if (!password2) {
            setPassword2ErrorMessage('비밀번호를 입력하세요.');
            errorOccured = true
        }

        if (password1 !== password2) {
            setPassword2ErrorMessage('비밀번호가 일치하지 않습니다.');
            errorOccured = true
        }

        if (!errorOccured) {
            setResetBtnDisabled(true)
            apis.changePassword(token, password1).then(response => {
                alert('비밀번호를 변경했습니다.')
                setResetBtnDisabled(false)
                history.push('/signin')
            }).catch(error => {
                alert('비밀번호 변경에 실패했습니다.')
                setResetBtnDisabled(false)
            })
        }
    }

    return (
        <div className={classes.layout}>
            <Paper className={classes.paper}>
                {/* <img src={Logo} alt="logo" className={classes.logo} /> */}
                <Typography variant="h3" component="h3" className={classes.title}>
                    비밀번호 초기화
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <form onSubmit={onSubmit}>
                            <TextField
                                variant="outlined"
                                error={!!password1ErrorMessage}
                                helperText={password1ErrorMessage}
                                name="password"
                                label="비밀번호"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={password1}
                                onChange={(e) => { setPassword1(e.target.value); setPassword1ErrorMessage('') }}
                            />
                            <TextField
                                variant="outlined"
                                error={!!password2ErrorMessage}
                                helperText={password2ErrorMessage}
                                name="password"
                                label="비밀번호"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={password2}
                                onChange={(e) => { setPassword2(e.target.value); setPassword2ErrorMessage('') }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                className={classes.loginBtn}
                                disabled={resetBtnDisabled}>초기화 메일 전송</Button><br />

                        </form>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
})