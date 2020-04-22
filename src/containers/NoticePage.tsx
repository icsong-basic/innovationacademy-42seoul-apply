import React, { useState, useEffect } from 'react'
import { Container, Box, Typography } from '@material-ui/core'
import PageLoadingIndicator from '../components/PageLoadingIndicator';
import apis, { PostList } from '../apis';
import { withRouter } from 'react-router';
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';

import ChevronRight from '@material-ui/icons/ChevronRight';
import ChevronLeft from '@material-ui/icons/ChevronLeft';

export default withRouter(function NoticePage({ history, location }) {
    const [initialLoadWaiting, setInitialLoadWaiting] = useState<boolean>(!(location.state));
    const [postList, setPostList] = useState<PostList | null>((location.state ? location.state.postList : null) || null);
    const [page, setPage] = useState<number>((location.state ? location.state.page : 0) || 0);
    useEffect(() => {
        loadPage(page);
        return () => { };
    }, [page])


    const loadPage = async (page: number = 0) => {
        try {
            const data = (await apis.getNoticeList(page, 15)).data
            setPostList(data)
            history.replace({
                state: { page, postList: data }
            })
        } catch (error) {
            alert('공지사항을 불러오는 데 실패했습니다.');
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
                        postList ?
                            <>
                                <div className="board">
                                    {
                                        postList.content.map((item, key) => {
                                            return <Link
                                                to={{
                                                    pathname: `/notice/${item.id}`,
                                                    state: { showBackButton: true }
                                                }} key={key}>
                                                <span className="title">{item.title}</span>
                                                <span className="write-at">{moment(item.writeAt).format('YYYY-MM-DD')}</span>
                                            </Link>
                                        })
                                    }
                                </div>
                                <ReactPaginate
                                    containerClassName="paginate"
                                    pageRangeDisplayed={4}
                                    marginPagesDisplayed={1}
                                    pageCount={postList.totalPages}
                                    previousLabel={<ChevronLeft style={arrowStyle} />}
                                    nextLabel={<ChevronRight style={arrowStyle} />}
                                    forcePage={page}
                                    onPageChange={({ selected }) => {
                                        setPage(selected)
                                    }}
                                />
                            </>
                            : undefined

                }
            </Box>
        </Container>
    )
}
)

const arrowStyle = {
    width: 21,
    height: 21,
}