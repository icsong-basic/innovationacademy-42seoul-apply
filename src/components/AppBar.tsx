import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import userSingleton from '../stores/userSingleton';
import { NavLink, Link } from 'react-router-dom';
import { navDrawerOpened } from './NavDrawer';

interface Props {

}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    }
}));

export default function ({ }: Props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<any>(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [])

    const onScroll = () => {
        const appBarElement = document.getElementById('appbar');
        if (appBarElement) {
            if ((window.pageYOffset || document.documentElement.scrollTop) === 0) {
                appBarElement.classList.add('top')
            } else {
                appBarElement.classList.remove('top')
            }
        }
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose()
        userSingleton.logout()
    }

    return (
        <AppBar id="appbar" position="static" className="top">
            <Toolbar>
                <IconButton edge="start" className={`${classes.menuButton} hamburger-menu`} color="inherit" aria-label="menu" onClick={() => { navDrawerOpened.set(true); }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className="links">
                    <NavLink to="/notice">공지사항</NavLink>
                    <NavLink to="/mypage">개인정보 변경</NavLink>
                    <NavLink to="/essay">에세이</NavLink>
                </Typography>
                <div className="right">
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={(e) => {
                            setAnchorEl(e.currentTarget);
                        }}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={open}
                        onClose={handleMenuClose}
                    >
                        <Link to="/user-password-change">
                            <MenuItem style={{ color: '#ffffff' }}>비밀번호 변경</MenuItem>
                        </Link>
                        <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    )
}
