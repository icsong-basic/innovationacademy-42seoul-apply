import React, { useEffect, useState } from 'react'
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme, Modal, Fade, Backdrop } from '@material-ui/core';
import apis from '../apis';
import PageLoadingIndicator from '../components/PageLoadingIndicator';

interface Props {
    boardId: number
    postId: number
    open: boolean
    onClose: any
}

export default function BoardPostModal({ boardId, postId, open, onClose }: Props) {
    const classes = useStyles();
    const [waiting, setWaiting] = useState(false)
    const [content, setContent] = useState('')
    useEffect(() => {
        if (open) {
            setWaiting(true)
            apis.viewBoardPost(boardId, postId).then(response => {
                setContent(response.data.contents || '')
                setWaiting(false)
            }).catch(error => {
                setContent(`<p>글을 불러오는데 실패했습니다.</p>`)
                setWaiting(false)
            })
        }
        return () => { };
    }, [open])

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={`${classes.modal} board-post-modal`}
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <div className={`${classes.paper} paper`}>
                    <div>
                        {
                            waiting ?
                                <PageLoadingIndicator /> :
                                <div className="quill-content" dangerouslySetInnerHTML={{ __html: content }} />

                        }
                    </div>
                    <button className="close-btn" onClick={onClose}>닫기</button>
                </div>
            </Fade>
        </Modal>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none'
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5]
        },
    }),
);