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


export default withRouter(function ForgotPassword({ history, location }) {
    const classes = useStyles();
    const [email, setEmail] = useState(location.state && location.state.email ? location.state.email : '')
    const [emailErrorMessage, setEmailErrorMessage] = useState('')
    const [resetBtnDisabled, setResetBtnDisabled] = useState(false)

    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!email) {
            setEmailErrorMessage('이메일을 입력하세요.');
        }
        if (emailErrorMessage) {
            return;
        }
        setResetBtnDisabled(true)

        apis.forgotPassword(email).then(response => {
            alert('비밀번호 초기화 메일을 발송했습니다.')
            history.push('/signin')
            setResetBtnDisabled(false)
        }).catch(error => {
            if (error.response && error.response.status === 404) {
                alert('계정을 찾을 수 없습니다.')
            } else {
                alert('비밀번호 초기화 메일 발송에 실패했습니다.')
            }
            setResetBtnDisabled(false)
        })
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
                                error={!!emailErrorMessage}
                                helperText={emailErrorMessage}
                                name="email"
                                label="이메일"
                                fullWidth
                                margin="normal"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setEmailErrorMessage('') }}
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