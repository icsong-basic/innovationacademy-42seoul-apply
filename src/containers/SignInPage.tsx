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
import BoardPostModal from '../modals/BoardPostModal';
import utils from '../utils';
import { agreementPostId, privacyPolicyId } from '../constants';

const Logo = require("../assets/images/logo.png")

export default withRouter(function SignInPage({ history }) {
    const classes = useStyles();
    const [email, setEmail] = useState('')
    const [emailErrorMessage, setEmailErrorMessage] = useState('')
    const [password, setPassword] = useState('')
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
    const [loginBtnDisabled, setLoginBtnDisabled] = useState(false)

    const [showAgreement, setShowAgreement] = useState(false)
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)

    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!email) {
            setEmailErrorMessage('이메일을 입력하세요.');
        }
        if (!password) {
            setPasswordErrorMessage('비밀번호를 입력하세요.');
        }
        if (emailErrorMessage || passwordErrorMessage) {
            return;
        }
        setLoginBtnDisabled(true)

        apis.login(email, password).then(async response => {
            const user = response.data;

            if (response.data.type !== 'student_42seoul') {
                alert('학생 계정만 로그인가능합니다.');
                try {
                    await apis.logout()
                } catch (error) {
                } finally {
                    userSingleton.logined = false;
                    userSingleton.email = ''
                    setLoginBtnDisabled(false)
                }
            } else {
                userSingleton.saveAccount(response.data)
                userSingleton.logined = true;
                try {
                    const studentInfoRes = await apis.getStudentInfo();
                    if (studentInfoRes.data) {
                        userSingleton.termsOfUseAgreementAt = studentInfoRes.data.termsOfUseAgreementAt;
                        userSingleton.personalInformationAgreementAt = studentInfoRes.data.personalInformationAgreementAt;
                    }
                } catch (error) {
                    userSingleton.termsOfUseAgreementAt = null
                    userSingleton.personalInformationAgreementAt = null
                }
                history.push('/')
            }
        }).catch(error => {
            alert('로그인에 실패했습니다.')
            setLoginBtnDisabled(false)
        })
    }

    return (
        <div className={classes.layout}>
            <Paper className={classes.paper}>
                {/* <img src={Logo} alt="logo" className={classes.logo} /> */}
                <Typography variant="h2" component="h2" className={classes.title}>
                    <img style={{ height: '2em' }} src="/assets/images/img-42-seoul.png" srcSet="/assets/images/img-42-seoul@2x.png 2x, /assets/images/img-42-seoul@3x.png 3x" alt="42 Seoul logo" />
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
                            <TextField
                                variant="outlined"
                                error={!!passwordErrorMessage}
                                helperText={passwordErrorMessage}
                                name="password"
                                label="비밀번호"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setPasswordErrorMessage('') }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                className={classes.loginBtn}
                                disabled={loginBtnDisabled}>로그인</Button><br />
                            <Link to={{ pathname: '/forgot-password', state: { email } }}>
                                <Button
                                    className={classes.forgotPwBtn}>
                                    비밀번호 변경/찾기
                            </Button>
                            </Link>
                            <div>
                                <Button
                                    onClick={() => { setShowAgreement(true) }}
                                    className={classes.forgotPwBtn}>
                                    이용약관
                            </Button>
                                <Button
                                    onClick={() => { setShowPrivacyPolicy(true) }}
                                    className={classes.forgotPwBtn}>
                                    개인정보처리방침
                            </Button>
                            </div>
                        </form>
                    </Grid>
                </Grid>
            </Paper>
            {
                [
                    { open: showAgreement, onClose: () => { setShowAgreement(false) }, postId: agreementPostId },
                    { open: showPrivacyPolicy, onClose: () => { setShowPrivacyPolicy(false) }, postId: privacyPolicyId },
                ].map(({ open, onClose, postId }, key) => {
                    return <BoardPostModal
                        key={key}
                        open={open}
                        onClose={onClose}
                        boardId={postId.boardId}
                        postId={postId.postId}
                    />
                })
            }
        </div>
    );
})

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
