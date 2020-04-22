import React, { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import apis from '../apis'
import Axios from 'axios';
import Delete from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';
import userSingleton from '../stores/userSingleton';

interface Props {
    className?: string,
    uploadName: string,
    value?: string,
    onChange?: (url: string) => void
}

export default function PhotoInput({ uploadName, value, className, onChange }: Props) {
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles[0]) {
            const file = acceptedFiles[0]
            apis.uploadData(uploadName, file).then(async response => {
                try {
                    const uploadUrlResponse = await Axios.get(response.data.url)
                    if (onChange) {
                        onChange(uploadUrlResponse.data.url)
                    }
                } catch (error) {
                    alert('사진 URL을 가져올 수 없습니다.');
                }
            }).catch(error => {
                alert('업로드에 실패했습니다.');
            })
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        maxSize: 20 * 1024 * 1024,
        accept: "image/*",
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
            className={`photo-input ${value ? '' : 'dotted'} ${className}`}
            {...getRootProps()}
            style={value ? { backgroundImage: `url(${value})` } : undefined}
        >
            <input {...getInputProps()} />
            {
                value ?
                    undefined :
                    (isDragActive ?
                        <p>파일을 여기에 드롭하세요.</p> :
                        <p>이미지를 드롭다운하시거나<br />여기를 클릭해주세요</p>)
            }
            {

            }
            {/* {
                value ?
                    <IconButton className="delete-button" onClick={e => {
                        e.stopPropagation();
                        if (onChange) {
                            onChange('')
                        }
                    }}>
                        <Delete />
                    </IconButton> : undefined
            } */}
        </div>
    )
}