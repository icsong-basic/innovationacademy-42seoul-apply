import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react';
import userSingleton from '../stores/userSingleton';
import { withRouter, Switch, Redirect, Route } from 'react-router';
import AppBar from '../components/AppBar';
import MyPage from './MyPage';
import NoticePage from './NoticePage';
import EssayPage from './EssayPage';
import NoticeViewPage from './NoticeViewPage';
import NavDrawer from '../components/NavDrawer';
import UserPasswordChange from './UserPasswordChange';

interface Props {

}

export default observer(
    (function MainPage({ history }) {
        useEffect(() => {
            if (!userSingleton.loginChecking && !userSingleton.logined) {
                if (history) {
                    history.push('/signin')
                }
            }
            if (!userSingleton.loginChecking && userSingleton.logined && (!userSingleton.personalInformationAgreementAt || !userSingleton.termsOfUseAgreementAt)) {
                if (history) {
                    history.push('/agreement')
                }
            }
            return () => { };
        }, [userSingleton.loginChecking])

        if (userSingleton.loginChecking) {
            return <div className="login-checking">
                Checking...
        </div>
        }
        return (
            <>
                <NavDrawer />
                <AppBar />
                <main>
                    <Switch>
                        <Route path="/user-password-change" component={UserPasswordChange} />
                        <Route path="/mypage" component={MyPage} />
                        <Route path="/essay" component={EssayPage} />
                        <Route path="/notice/:id" component={NoticeViewPage} />
                        <Route path="/notice" component={NoticePage} />
                        <Redirect to="/notice" />
                    </Switch>
                </main>
            </>
        )
    })
)