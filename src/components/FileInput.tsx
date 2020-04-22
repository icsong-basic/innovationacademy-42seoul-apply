import React, { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import apis from '../apis'
import Axios from 'axios';
import Delete from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';
import userSingleton from '../stores/userSingleton';

interface Props {
    className?: string,
    label?: string,
    value?: any,
    uploadedValue?: string,
    onFileChange?: (file: any) => void,
    onUploadedValueChange?: (url: string) => void
}

export default function FileInput({ label = '', value, uploadedValue, className, onFileChange, onUploadedValueChange }: Props) {
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles[0]) {
            const file = acceptedFiles[0]
            onUploadedValueChange ?.('');
            onFileChange ?.(file);
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        maxSize: 20 * 1024 * 1024,
        onDropRejected: (files, event) => {
            if (files[0]) {
                if (files[0].size > (20 * 1024 * 1024)) {
                    alert('최대 20MB까지 업로드 가능합니다.')
                } else {
                    alert('업로드 할 수 없는 파일입니다.')
                }
            }
        }
    })

    return (
        <div
            className={`file-input ${value ? '' : 'dotted'} ${className}`}
            {...getRootProps()}
            style={value ? { backgroundImage: `url(${value})` } : undefined}
        >
            <input {...getInputProps()} />
            {
                uploadedValue ?
                    (
                        <p>
                            {`${label ? (label + ' ') : ''}업로드 완료`}<br />
                            <IconButton className="delete-button" onClick={e => {
                                e.stopPropagation();
                                if (onUploadedValueChange) {
                                    onUploadedValueChange ?.('')
                                }
                            }}>
                                <Delete />
                            </IconButton>
                        </p>
                    ) :
                    (
                        value ?
                            <p>
                                {label}
                                {label ? <> 업로드 대기 <br /></> : undefined}
                                <span className="file-name">{value.name}</span>
                                <IconButton className="delete-button" onClick={e => {
                                    e.stopPropagation();
                                    if (onFileChange) {
                                        onFileChange ?.(null)
                                    }
                                }}>
                                    <Delete />
                                </IconButton>
                            </p> :
                            (isDragActive ?
                                <p>{label ? (label + ' ') : ''}파일을 여기에 드롭하세요.<br/>(최대 용량 20MB)</p> :
                                <p>{label ? (label + ' ') : ''}파일을 드롭다운하시거나<br />여기를 클릭해주세요<br/>(최대 용량 20MB)</p>)
                    )
            }
        </div>
    )
}