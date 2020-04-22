import React, { useState, useEffect } from 'react'
import { Container, Box, Button, Typography } from '@material-ui/core'
import PageLoadingIndicator from '../components/PageLoadingIndicator';
import apis, { PostList, Post } from '../apis';
import { withRouter } from 'react-router';
import moment from 'moment';
import { Link } from 'react-router-dom';

export default withRouter(function NoticeViewPage({ history, location, match }) {
    const [initialLoadWaiting, setInitialLoadWaiting] = useState<boolean>(true);
    const [post, setPost] = useState<Post & { contents: string } | null>(null)

    useEffect(() => {
        loadPost(match.params.id);
        return () => { };
    }, [match.params.id])

    const loadPost = async (postId: number) => {
        try {
            const post = (await apis.viewNotice(postId)).data;
            setPost(post);
        } catch (error) {
            alert('게시글을 불러올 수 없습니다.')
            history.goBack();
        }
        setInitialLoadWaiting(false);
    }

    return (
        <Container className="notice-page" maxWidth="md">
            <Box className="box">
                <Typography variant="h4" className="page-title">공지사항</Typography>
                {
                    initialLoadWaiting ?
                        <PageLoadingIndicator /> :
                        post ?
                            <div className="post">
                                <p className="title">{post.title}</p>
                                <p className="write-at">{moment(post.writeAt).format('YYYY.MM.DD')}</p>
                                <p className="contents quill-content" dangerouslySetInnerHTML={{ __html: post.contents }} />
                                {post.attachments ? <a download href={post.attachments}>첨부파일</a> : undefined}
                                {
                                    location.state && location.state.showBackButton ?
                                        <Button color="primary" onClick={() => { history.goBack() }}>뒤로 가기</Button> :
                                        <Link to="/notice"><Button color="primary">목록</Button></Link>
                                }
                            </div> : undefined

                }
            </Box>
        </Container>
    )
}
)