import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Paper, FormControlLabel, Checkbox, TextField, Button } from '@material-ui/core';
import Axios from 'axios';
import apis from '../apis';
import { agreementPostId, privacyPolicyId } from '../constants';
import userSingleton from '../stores/userSingleton';
import PageLoadingIndicator from '../components/PageLoadingIndicator';
import ButtonWaitingIndicator from '../components/ButtonWaitingIndicator';
import { withRouter } from 'react-router';

export default withRouter(function AgreementPage({ history }) {
    const classes = useStyles()
    const [agreementChecked, setAgreementChecked] = useState(false)
    const [privacyPolicyChecked, setPrivacyPolicyChecked] = useState(false)
    const [agreement, setAgreement] = useState<string>('')
    const [privacyPolicy, setPrivacyPolicy] = useState<string>('')
    const [waiting, setWaiting] = useState(true)
    const [saveWaiting, setSaveWaiting] = useState<boolean>(false);

    useEffect(() => {
        if (!userSingleton.loginChecking && !userSingleton.logined) {
            history.replace('/signin')
            return;
        }
        fetchAgreements();
        return () => { };
    }, [])

    const onAgreementClick = () => {
        if (!agreementChecked || !privacyPolicyChecked) {
            alert('모든 항목에 동의하셔야 합니다.');
            return
        }
        setSaveWaiting(true);
        apis.registerAgreeToAgreement().then(response => {
            const { termsOfUseAgreementAt, personalInformationAgreementAt } = response.data;
            userSingleton.termsOfUseAgreementAt = termsOfUseAgreementAt;
            userSingleton.personalInformationAgreementAt = personalInformationAgreementAt;
            history.push('/')
        }).catch(error => {
            alert('약관동의에 실패했습니다.')
            setSaveWaiting(false);
        })
    }

    const fetchAgreements = () => {
        setWaiting(true);
        Axios.all([agreementPostId, privacyPolicyId].map(({ boardId, postId }) => (apis.viewBoardPost(boardId, postId)))).then(Axios.spread((agreementRes, privacyPolicyRes) => {
            const { data: agreementData } = agreementRes;
            const { data: privacyPolicyData } = privacyPolicyRes;
            setAgreement(agreementData.contents || '')
            setPrivacyPolicy(privacyPolicyData.contents || '')
            setWaiting(false);
        })).catch(error => {
            alert(`약관을 불러오는 중 에러가 발생했습니다.`)
            userSingleton.logout();
        })
    }

    return (
        <div className={classes.layout}>
            <Paper className={classes.paper}>
                {
                    waiting ?
                        <PageLoadingIndicator /> :
                        <div className={classes.agreements}>
                            {
                                [
                                    { label: '이노베이션 아카데미 이용약관 동의(필수)', text: agreement, checked: agreementChecked, checkedSetter: setAgreementChecked },
                                    { label: '개인정보 수집 및 이용에 대한 안내(필수)', text: privacyPolicy, checked: privacyPolicyChecked, checkedSetter: setPrivacyPolicyChecked }
                                ].map(({ checked, label, text, checkedSetter }, key) => {
                                    return <div key={key} style={key > 0 ? { marginTop: '1em' } : undefined}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox color="primary" checked={checked} onChange={() => { checkedSetter(!checked) }} value={checked} />
                                            }
                                            label={label}
                                        />
                                        <div className={classes.agreementText} dangerouslySetInnerHTML={{ __html: text }} />
                                    </div>
                                })
                            }
                        </div>
                }
                {waiting ? undefined : <Button
                    disabled={saveWaiting}
                    className={classes.agreeBtn}
                    color={agreementChecked && privacyPolicyChecked ? "primary" : "default"}
                    fullWidth
                    variant="contained"
                    onClick={onAgreementClick}
                    size="large"
                    endIcon={saveWaiting ? <ButtonWaitingIndicator /> : undefined}
                >
                    동의
                </Button>}
            </Paper>
        </div>
    )
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
        backgroundColor: 'rgba(255,255,255,0.1)',
        color: '#ffffff',
        borderRadius: theme.spacing(1)
    },
    agreeBtn: {
        marginTop: theme.spacing(1),
    },
    agreements: {
        padding: theme.spacing(3),
    },
    agreementText: {
        maxWidth: 500,
        maxHeight: 250,
        overflowY: 'auto',
        fontSize: 13,
        backgroundColor: '#ffffff',
        color: 'black',
        padding: '1em',
        borderRadius: 5,
        border: '1px solid rgba(0,0,0,0.3)'
    }
}))