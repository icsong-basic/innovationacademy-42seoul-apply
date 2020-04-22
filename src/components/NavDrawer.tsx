import React from 'react'
import { Drawer, Divider, List, ListItemIcon, ListItemText, ListItem } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { observable } from 'mobx'
import { observer } from 'mobx-react-lite';



export const navDrawerOpened = observable.box(false);

export default observer(function NavDrawer({ }) {

    return (
        <>
            <Drawer
                className="nav-drawer mobile"
                open={navDrawerOpened.get()}
                onClose={() => {
                    navDrawerOpened.set(false);
                }}
                anchor="left"
            >
                <div />
                <Divider />
                <List>
                    {
                        [
                            { label: '공지사항', path: '/notice' },
                            { label: '개인정보 변경', path: '/mypage' },
                            { label: '에세이', path: '/essay' }
                        ].map(
                            ({ label, path }, key) => {
                                return <Link to={path} key={key} onClick={() => { navDrawerOpened.set(false) }}>
                                    <ListItem button>
                                        <ListItemText primary={label} />
                                    </ListItem>
                                </Link>

                            }
                        )
                    }
                </List>
            </Drawer>
        </>
    )
}
)