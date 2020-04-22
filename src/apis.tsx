import axios from 'axios';
import queryString from 'query-string';
import { StudentInfo } from './stores/userSingleton';

const contentTypeKey = 'Content-Type'
const contentTypeJson = 'application/json'
const instance = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        [contentTypeKey]: contentTypeJson,
        common: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
    },
    transformRequest: [
        (data, headers) => {
            if (data && FormData && data instanceof FormData) return data

            if (headers[contentTypeKey] === contentTypeJson) {
                if (typeof data === 'string' || data instanceof String) {
                    return data
                }
                return JSON.stringify(data)
            }
            // return querystring.stringify(data)
        },
    ],
})

export default {
    /**
     * 로그인
     */
    login(email: string, password: string) {
        return instance.post('/v1/account/login', { email, password })
    },
    forgotPassword(email: string) {
        return instance.post(`/v1/account/password/reset?${queryString.stringify({ email })}`)
    },
    changePassword(token: string, password: string) {
        return instance.post(`/v1/account/password/reset/token`, { token, password })
    },
    changeUserPassword(oldPassword: string, newPassword: string) {
        return instance.put(`/v1/account/password?${queryString.stringify({ oldPassword, newPassword })}`)
    },
    logout() {
        return instance.get('/logout')
    },
    getAccount() {
        return instance.get('/v1/account');
    },
    uploadData(name: string, data: any) {
        const formData = new FormData();
        formData.append('data', data);
        return instance.post(`/v1/data/student?${queryString.stringify({ name })}`, formData)
    },
    getStudentInfo() {
        return instance.get<StudentInfo>('/v1/student/info');
    },
    postStudentInfo(info: StudentInfo) {
        return instance.post('/v1/student/info', info)
    },
    putStudentInfo(info: StudentInfo) {
        return instance.put('/v1/student/info', info)
    },
    getEssay() {
        return instance.get<{ id: number, text: string }[]>('/v1/student/essay');
    },
    postEssay(id: number, text: string) {
        return instance.post(`/v1/student/essay?id=${id}`, text)
    },
    putEssay(id: number, text: string) {
        return instance.put(`/v1/student/essay?id=${id}`, text)
    },
    getMyData() {
        return instance.get<{ name: string, url: string }[]>('/v1/data')
    },
    deleteMyData(name: string) {
        return instance.delete('/v1/data', { params: { name } })
    },
    getNoticeList(page = 0, size = 15) {
        return instance.get<PostList>(`/v1/board/9/posts?page=${page}&size=${size}`);
    },
    viewNotice(postId: number) {
        return instance.get<Post & { contents: string }>(`/v1/board/9/posts/${postId}`)
    },
    viewBoardPost(boardId: number, postId: number) {
        return instance.get<Post & { contents: string }>(`/v1/board/${boardId}/posts/${postId}`)
    },
    registerAgreeToAgreement() {
        return instance.post('/v1/student/agreement');
    }
}

export interface PostList {
    "content": Post[],
    "totalPages": number,
}

export interface Post {
    id: number,
    boardId: number
    author: string
    title: string
    thumbnail: string
    image: string
    summary: string
    link: string
    attachments: string | null,
    writeAt: number,
    publishedAt: number
    contents?: string
}