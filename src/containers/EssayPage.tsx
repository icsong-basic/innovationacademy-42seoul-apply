import React, { useState, useEffect } from 'react'
import { Container, Box, TextField, Typography, Button, CircularProgress } from '@material-ui/core'
import PageLoadingIndicator from '../components/PageLoadingIndicator';
import apis from '../apis';
import Josa from 'josa-js';
import SaveIcon from '@material-ui/icons/Save';
import ButtonWaitingIndicator from '../components/ButtonWaitingIndicator';

interface Props {

}

export default function EssayPage({ }: Props) {
    const [saveWaiting, setSaveWaiting] = useState<boolean>(false);
    const [initialLoadWaiting, setInitialLoadWaiting] = useState<boolean>(true);

    const [essays, setEssays] = useState<{ id: number, text: string }[]>([])
    const [essay1, setEssay1] = useState<string>('')
    const [essay2, setEssay2] = useState<string>('')

    useEffect(() => {
        loadEssay();
        return () => { };
    }, [])

    const loadEssay = async () => {
        try {
            const essays = (await apis.getEssay()).data
            const essay1Obj = essays.find(item => item.id === 1)
            const essay2Obj = essays.find(item => item.id === 2)
            setEssays(essays)
            setEssay1((essay1Obj ? essay1Obj.text : '') || '');
            setEssay2((essay2Obj ? essay2Obj.text : '') || '');
        } catch (error) {
            if (!error.response || error.response.status !== 404) {
                alert('에세이를 불러오는 데 실패했습니다.');
            }
        }
        setInitialLoadWaiting(false);
    }

    const save = async () => {
        setSaveWaiting(true);
        const errorMessages = [];
        for (let { id, value } of [{ id: 1, value: essay1 }, { id: 2, value: essay2 }]) {
            const saveFunc = (essays.find((item) => item.id === id)) ? apis.putEssay : apis.postEssay;
            try {
                await saveFunc(id, value)
            } catch (error) {
                errorMessages.push(`${Josa.r('에세이' + id, '을/를')} 저장하는데 실패했습니다.`);
            }
        }
        if (errorMessages.length > 0)
            alert(errorMessages.join('\n'))
        setSaveWaiting(false);
        await loadEssay()
    }

    return (
        <Container className="essay-page" maxWidth="md">
            <Box className="box">
                <Typography variant="h4" className="page-title">에세이</Typography>
                {
                    initialLoadWaiting ?
                        <PageLoadingIndicator /> :
                        <>
                            {
                                [
                                    { question: '1. 42 SEOUL에 지원한 이유는 무엇인가요? (최대 500자)', value: essay1, setter: setEssay1, maxLength: 500 },
                                    { question: '2. 42 SEOUL 에서 향후 어떤 역량을 개발해 나갈지 각오 및 계획을 기술해 주세요. (최대 500자)', value: essay2, setter: setEssay2, maxLength: 500 }
                                ].map(({ question, value, setter, maxLength }, key) => {
                                    return <div className="essay-box" key={key}>
                                        <p className="question">{question}</p>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows="10"
                                            variant="outlined"
                                            value={value}
                                            onChange={e => {
                                                const newVal = e.target.value.substr(0, maxLength)
                                                setter(newVal)
                                            }}
                                        />
                                        <p className="essay-length">({value.length}자 / {maxLength}자)</p>
                                    </div>
                                })
                            }
                            <Button
                                disabled={saveWaiting}
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                onClick={save}
                                startIcon={<SaveIcon />}
                                endIcon={saveWaiting ? <ButtonWaitingIndicator /> : undefined}
                            >
                                저장
                            </Button>
                        </>
                }
            </Box>
        </Container>
    )
}
