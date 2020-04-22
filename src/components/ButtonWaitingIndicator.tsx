import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
    }),
);

export default function ButtonWaitingIndicator() {
    const classes = useStyles();

    return (
        <CircularProgress style={{
            width: 20,
            height: 20
        }} />
    );
}