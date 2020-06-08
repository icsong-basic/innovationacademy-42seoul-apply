import React, { useState, useEffect } from 'react'
import { Box, Container, Typography, TextField, FormControl, InputLabel, MenuItem, OutlinedInput, InputAdornment, IconButton, Button } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import PhotoInput from '../components/PhotoInput';
import Select from '../components/Select';
import userSingleton, { StudentInfo, employmentStatusType } from '../stores/userSingleton';
import CountrySelect from '../components/CountrySelect';
import utils from '../utils';
import Close from '@material-ui/icons/Close';
import DaumPostcode from 'react-daum-postcode';
import moment from 'moment';
import apis from '../apis';
import FileInput from '../components/FileInput';
import TelephoneInput from '../components/TelephoneInput';
import { userDataKeys } from '../constants';
import Josa from 'josa-js';
import PageLoadingIndicator from '../components/PageLoadingIndicator';
import SaveIcon from '@material-ui/icons/Save';
import ButtonWaitingIndicator from '../components/ButtonWaitingIndicator';

interface Props {

}

export default function MyPage({ }: Props) {
    const [saveWaiting, setSaveWaiting] = useState<boolean>(false);
    const [initialLoadWaiting, setInitialLoadWaiting] = useState<boolean>(true);

    const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)
    const [photos, setPhotos] = useState<{ name: string, url: string }[]>([])

    const [profilePhoto, setProfilePhoto] = useState<string>('')
    const [profilePhotoFile, setProfilePhotoFile] = useState<any | null>(null)
    const [identificationPhoto, setIdentificationPhoto] = useState<string>('')
    const [identificationPhotoFile, setIdentificationPhotoFile] = useState<any | null>(null)
    const [bankbookPhoto, setBankbookPhoto] = useState<string>('')
    const [bankbookPhotoFile, setBankbookPhotoFile] = useState<any | null>(null)
    // const [insurancePaymentHistoryPhoto, setInsurancePaymentHistoryPhoto] = useState<string>('')
    // const [insurancePaymentHistoryPhotoFile, setInsurancePaymentHistoryPhotoFile] = useState<any | null>(null)
    const [residentRegistrationPhoto, setResidentRegistrationPhoto] = useState<string>('')
    const [residentRegistrationPhotoFile, setResidentRegistrationPhotoFile] = useState<any | null>(null)
    const [fourInsurancesPhoto, setFourInsurancesPhoto] = useState<string>('')
    const [fourInsurancesPhotoFile, setFourInsurancesPhotoFile] = useState<any | null>(null)
    const [etcEvidencePhoto, setEtcEvidencePhoto] = useState<string>('')
    const [etcEvidencePhotoFile, setEtcEvidencePhotoFile] = useState<any | null>(null)

    const [korName, setKorName] = useState<string>('')
    const [engName, setEngName] = useState<string>('')
    const [country, setCountry] = useState<string>('')
    const [birthday, setBirthday] = useState<string>('')
    const [sex, setSex] = useState<"male" | "female" | "">('')
    const [socialSecurityNumber, setSocialSecurityNumber] = useState<string>('')
    const [postalCode, setPostalCode] = useState<string>('')
    const [address, setAddress] = useState<string>('')
    const [addressDetail, setAddressDetail] = useState<string>('')
    const [city, setCity] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [emergencyContactName, setEmergencyContactName] = useState<string>('')
    const [emergencyContactRelation, setEmergencyContactRelation] = useState<string>('')
    const [emergencyContactPhoneNumber, setEmergencyContactPhoneNumber] = useState<string>('')
    const [admissionDate, setAdmissionDate] = useState<number | string>('')
    const [highestLevelOfEducation, setHighestLevelOfEducation] = useState<string>('')
    const [major, setMajor] = useState<string>('')
    const [softwareCareerYear, setSoftwareCareerYear] = useState<number>(0);
    const [employmentStatus, setEmploymentStatus] = useState<employmentStatusType>('미취업자');
    const [accountNumber, setAccountNumber] = useState<string>('')
    const [bank, setBank] = useState<string>('')

    const [showDaumPostcodeSearch, setShowDaumPostcodeSearch] = useState<boolean>(false)

    const save = async () => {
        const errorMessages = getInputErrorMessages();
        if (errorMessages.length > 0) {
            alert(errorMessages.join('\n'))
            return;
        }



        setSaveWaiting(true);
        await saveStudentInfo()
        await savePhotos()
        await fetchDatas();
        setSaveWaiting(false);

    }

    const saveStudentInfo = async () => {
        const param: StudentInfo = {
            korName,
            engName,
            country,
            birthday,
            sex,
            socialSecurityNumber,
            postalCode,
            address,
            addressDetail,
            city,
            phoneNumber,
            emergencyContactName,
            emergencyContactRelation,
            emergencyContactPhoneNumber,
            admissionDate,
            highestLevelOfEducation,
            major,
            softwareCareerYear,
            employmentStatus,
            accountNumber,
            bank
        }

        let errorMessages = [];
        try {
            let response;
            if (studentInfo) {
                response = await apis.putStudentInfo(param)
            }
            else {
                response = await apis.postStudentInfo(param)
            }
            setStudentInfo(response.data)
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                errorMessages.push(error.response.data.message);
            } else {
                errorMessages.push('학생정보 저장에 실패했습니다.');
            }
        }
    }

    const savePhotos = async () => {
        let errorMessages = [];
        for (let { dataKey, photo, file } of [
            { dataKey: userDataKeys.bankbookPhoto, photo: bankbookPhoto, file: bankbookPhotoFile },
            { dataKey: userDataKeys.identificationPhoto, photo: identificationPhoto, file: identificationPhotoFile },
            // { dataKey: userDataKeys.insurancePaymentHistoryPhoto, photo: insurancePaymentHistoryPhoto, file: insurancePaymentHistoryPhotoFile },
            { dataKey: userDataKeys.residentRegistrationPhoto, photo: residentRegistrationPhoto, file: residentRegistrationPhotoFile },
            { dataKey: userDataKeys.fourInsurancesPhoto, photo: fourInsurancesPhoto, file: fourInsurancesPhotoFile },
            { dataKey: userDataKeys.etcEvidencePhoto, photo: etcEvidencePhoto, file: etcEvidencePhotoFile },
        ]) {
            try {
                if (file) {
                    await apis.uploadData(dataKey, file)
                } else {
                    if (!photo && photos.find(item => item.name === dataKey)) {
                        await apis.deleteMyData(dataKey)
                    }
                }
            } catch (error) {
                errorMessages.push(Josa.r(getDataKorLabel(dataKey), '을/를') + ' 업로드하는데 실패했습니다.');
            }
        }
        if (errorMessages.length > 0) {
            alert(errorMessages.join('\n'))
        }
    }

    useEffect(() => {
        fetchDatas();
        return () => { };
    }, [])

    const fetchDatas = async () => {
        let studentInfo: StudentInfo | null = null, photos: { name: string, url: string }[] = [];
        const errorMessages = []
        try {
            studentInfo = (await apis.getStudentInfo()).data
            setStudentInfo(studentInfo)
            if (studentInfo) {
                setBirthday((studentInfo.birthday ? moment(studentInfo.birthday).format('YYYY-MM-DD') : '') || '')
                setAddress(studentInfo.address || '')
                setAddressDetail(studentInfo.addressDetail || '')
                setCity(studentInfo.city || '')
                setAdmissionDate((studentInfo.admissionDate ? studentInfo.admissionDate : '') || '')
                setCountry(studentInfo.country || '')
                setEmergencyContactName(studentInfo.emergencyContactName || '')
                setEmergencyContactPhoneNumber(studentInfo.emergencyContactPhoneNumber || '')
                setEmergencyContactRelation(studentInfo.emergencyContactRelation || '')
                setEngName(studentInfo.engName || '')
                setHighestLevelOfEducation(studentInfo.highestLevelOfEducation || '')
                setKorName(studentInfo.korName || '')
                setMajor(studentInfo.major || '')
                setPhoneNumber(studentInfo.phoneNumber || '')
                setPostalCode(studentInfo.postalCode || '')
                setSex(studentInfo.sex || '')
                setSocialSecurityNumber(studentInfo.socialSecurityNumber || '')
                setSoftwareCareerYear(studentInfo.softwareCareerYear || 0);
                setEmploymentStatus(studentInfo.employmentStatus || '미취업자');
                setAccountNumber(studentInfo.accountNumber || '');
                setBank(studentInfo.bank || '');
            }
        } catch (error) {
            if (error.response && error.response.status !== 404)
                errorMessages.push(error.response && error.response.data && error.response.data.message ? error.response.data.message : '학생정보를 가져오는 데 실패했습니다.')
        }
        try {
            photos = (await apis.getMyData()).data;
            setPhotos(photos);
            if (photos) {
                const dataKeyAndSetterPairs = [
                    { key: userDataKeys.profilePhoto, setter: setProfilePhoto, fileSetter: setProfilePhotoFile },
                    { key: userDataKeys.bankbookPhoto, setter: setBankbookPhoto, fileSetter: setBankbookPhotoFile },
                    { key: userDataKeys.identificationPhoto, setter: setIdentificationPhoto, fileSetter: setIdentificationPhotoFile },
                    //{ key: userDataKeys.insurancePaymentHistoryPhoto, setter: setInsurancePaymentHistoryPhoto, fileSetter: setInsurancePaymentHistoryPhotoFile },
                    { key: userDataKeys.residentRegistrationPhoto, setter: setResidentRegistrationPhoto, fileSetter: setResidentRegistrationPhotoFile },
                    { key: userDataKeys.fourInsurancesPhoto, setter: setFourInsurancesPhoto, fileSetter: setFourInsurancesPhotoFile },
                    { key: userDataKeys.etcEvidencePhoto, setter: setEtcEvidencePhoto, fileSetter: setEtcEvidencePhotoFile },
                ]

                for (let { key, setter, fileSetter } of dataKeyAndSetterPairs) {
                    const photo = photos.find(item => item.name === key)
                    setter((photo ? photo.url : '') || '')
                    fileSetter(null)
                }
            }
        } catch (error) {
            if (error.response && error.response.status !== 404)
                errorMessages.push(error.response && error.response.data && error.response.data.message ? error.response.data.message : '사진을 가져오는 데 실패했습니다.')
        }
        setInitialLoadWaiting(false);
    }

    const getInputErrorMessages: () => string[] = () => {
        const errorMessages: string[] = [];

        for (let { label, value } of requiredInputs) {
            switch (label) {
                case '소프트웨어 관련 분야 경력':
                case '상세 주소':
                    continue;
                    break;
                case '연락처':
                    if (!value.replace(/-/gi, '')) {
                        errorMessages.push('연락처를 입력하셔야 합니다.');
                    }
                    break;
                default:
                    if (!value) {
                        errorMessages.push(`${Josa.r(label, '을/를')} 입력하셔야 합니다.`);
                    }
                    break;
            }
        }

        return errorMessages;
    }

    const requiredInputs: MyPageInputType[] = [
        { label: '한글 이름', type: 'text', value: korName, setter: setKorName },
        { label: '영문 이름', type: 'text', value: engName, setter: setEngName },
        { label: '성별', type: 'select', value: sex, setter: setSex, options: sexOptions },
        { label: '국적', type: 'country-select', value: country, setter: setCountry },
        { label: '생년월일', type: 'date', value: birthday, setter: setBirthday },
        { label: '연락처', type: 'telephone', value: phoneNumber, setter: setPhoneNumber },
        { label: '우편번호', type: 'address-post', value: postalCode, setter: setPostalCode, addressSetter: setAddress, addressFindOpener: setShowDaumPostcodeSearch },
        { label: '주소', type: 'address', value: address, setter: setAddress, postalCodeSetter: setPostalCode, addressFindOpener: setShowDaumPostcodeSearch },
        { label: '상세 주소', type: 'text', value: addressDetail, setter: setAddressDetail },
        { label: '최종 학력', type: 'select', value: highestLevelOfEducation, setter: setHighestLevelOfEducation, options: highestLevelOfEducationOptions },
        { label: '전공', type: 'text', value: major, setter: setMajor },
        { label: '입학일', type: 'select', value: admissionDate, setter: setAdmissionDate, options: admissionDateOptions },
        { label: '소프트웨어 관련 분야 경력', type: 'year', value: softwareCareerYear, setter: setSoftwareCareerYear },
        { label: '비상 연락처', type: 'text', value: emergencyContactPhoneNumber, setter: setEmergencyContactPhoneNumber },
        { label: '비상 연락처 이름', type: 'text', value: emergencyContactName, setter: setEmergencyContactName },
        { label: '비상 연락처 관계', type: 'autocomplete-text', value: emergencyContactRelation, setter: setEmergencyContactRelation, options: emergencyContactRelationOptions },
        { label: '취업 상태', type: 'autocomplete-text', value: employmentStatus, setter: setEmploymentStatus, options: employmentStatusOptions },
    ];

    const optionalInputs: MyPageInputType[] = [
        { label: '주민등록번호', type: 'social-security-number', value: socialSecurityNumber, setter: setSocialSecurityNumber },
        { label: '신분증 사진', type: 'file', value: identificationPhotoFile, uploadedValue: identificationPhoto, fileSetter: setIdentificationPhotoFile, uploadedValueSetter: setIdentificationPhoto },
        { label: '통장 사본', type: 'bank', value: bankbookPhotoFile, uploadedValue: bankbookPhoto, fileSetter: setBankbookPhotoFile, uploadedValueSetter: setBankbookPhoto, bank: bank, bankSetter: setBank, accountNumber: accountNumber, accountNumberSetter: setAccountNumber },
        // 200110 삭제요청
        // { label: '건강 보험 납부 내역서 사진', type: 'file', value: insurancePaymentHistoryPhotoFile, uploadedValue: insurancePaymentHistoryPhoto, fileSetter: setInsurancePaymentHistoryPhotoFile, uploadedValueSetter: setInsurancePaymentHistoryPhoto, comment: '건강보험납부내역서의 경우 공지사항을 먼저 확인해주세요.' },
        { label: '주민등록 초본 사진', type: 'file', value: residentRegistrationPhotoFile, uploadedValue: residentRegistrationPhoto, fileSetter: setResidentRegistrationPhotoFile, uploadedValueSetter: setResidentRegistrationPhoto },
        { label: '4대보험 가입 내역서 사진', type: 'file', value: fourInsurancesPhotoFile, uploadedValue: fourInsurancesPhoto, fileSetter: setFourInsurancesPhotoFile, uploadedValueSetter: setFourInsurancesPhoto },
        { label: '기타 증빙자료 사진', type: 'file', value: etcEvidencePhotoFile, uploadedValue: etcEvidencePhoto, fileSetter: setEtcEvidencePhotoFile, uploadedValueSetter: setEtcEvidencePhoto }
    ];

    return (
        <Container className="mypage" maxWidth="md">
            <Box className="box">
                <Typography variant="h4" className="page-title">개인정보 변경</Typography>
                {
                    initialLoadWaiting ?
                        <PageLoadingIndicator /> :
                        <>
                            <PhotoInput className="profile-input" uploadName="프로필사진" value={profilePhoto} onChange={(url) => {
                                setProfilePhoto(url)
                            }} />
                            <p className="italic text-align-center">{`<프로필 사진>`}</p>
                            <div className="inputs">
                                <p className="italic">* 필수 입력</p>
                                <hr />
                                <TextField
                                    disabled
                                    margin="normal"
                                    fullWidth
                                    label="이메일"
                                    variant="outlined"
                                    value={userSingleton.email}
                                />
                                {
                                    requiredInputs.map((item, key) => {
                                        return <MyPageInput {...item} key={key} />
                                    })
                                }
                                {
                                    showDaumPostcodeSearch && <div className="dim">
                                        <div className="daum-postcode-search-popup">
                                            <div className="text-align-right">
                                                <IconButton className="close-btn" onClick={e => { setShowDaumPostcodeSearch(false) }}                            >
                                                    <Close />
                                                </IconButton>
                                            </div>
                                            <DaumPostcode
                                                animation={true}
                                                onComplete={(data) => {
                                                    if (data) {
                                                        setCity(data.sido);
                                                        setPostalCode(data.zonecode)
                                                        setAddress(data.address)
                                                        setAddressDetail('')
                                                        setShowDaumPostcodeSearch(false)
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                }
                                <p className="italic" style={{ marginTop: '4em' }}>
                                    선택 입력
                                </p>
                                <p className="small">지원금을 받기 위한 입력 절차로 지원금 수령이 가능 하신 분만 입력해주시기 바랍니다.</p>
                                <hr />
                                {
                                    optionalInputs.map((item, key) => {
                                        return <MyPageInput {...item} key={key} />
                                    })
                                }
                                <Button
                                    startIcon={<SaveIcon />}
                                    fullWidth
                                    color={getInputErrorMessages().length === 0 ? 'primary' : 'default'}
                                    disabled={saveWaiting}
                                    variant="contained"
                                    size="large"
                                    className="save-button"
                                    endIcon={saveWaiting ? <ButtonWaitingIndicator /> : undefined}
                                    onClick={save}>
                                    저장
                                    </Button>
                            </div>
                        </>}
            </Box>
        </Container >
    )
}

interface MyPageInputType {
    type: 'text' | 'select' | 'country-select' | 'social-security-number' | 'date' | 'autocomplete-text' | 'address-post' | 'address' | 'year' | 'telephone' | 'file' | 'bank'
    label: string
    value: any
    setter?: any
    options?: { value: any, label: string }[] | string[],
    addressSetter?: any,
    postalCodeSetter?: any,
    addressFindOpener?: any,
    uploadedValue?: any,
    fileSetter?: any,
    uploadedValueSetter?: any,
    comment?: string,
    bank?: string,
    bankSetter?: any,
    accountNumber?: string,
    accountNumberSetter?: any,
}

function MyPageInput({ type, label, value, setter, options, addressSetter, addressFindOpener, postalCodeSetter, uploadedValue, fileSetter, uploadedValueSetter, comment, bank, bankSetter, accountNumber, accountNumberSetter }: MyPageInputType) {
    switch (type) {
        case 'text':
            return <TextField
                margin="normal"
                fullWidth
                label={label}
                variant="outlined"
                value={value}
                onChange={e => { setter(e.target.value) }}
            />
        case 'telephone':
            return <TelephoneInput
                label={label}
                value={value}
                onChange={newVal => { setter(newVal) }}
            />
        case 'select':
            return <Select
                label={label}
                margin="normal"
                variant="outlined"
                fullWidth
                value={value}
                onChange={(e) => {
                    setter(e.target.value)
                }}>
                {
                    (options as any[]).map((item, key) => {
                        if (typeof (item) === 'string') {
                            return <MenuItem key={key} value={item}>{item}</MenuItem>
                        } else {
                            const { label, value } = item;
                            return <MenuItem key={key} value={value}>{label}</MenuItem>
                        }
                    })
                }
            </Select>
        case 'country-select':
            return <CountrySelect
                label={label}
                margin="normal"
                variant="outlined"
                fullWidth
                value={value}
                onChange={(e) => {
                    setter(e.target.value)
                }}
            />
        case 'social-security-number':
            return <> <TextField
                margin="normal"
                fullWidth
                label={label}
                variant="outlined"
                value={utils.formatSocialSecurityNumber(value)}
                style={{ marginBottom: '0.5em' }}
                onChange={e => {
                    const text = e.target.value;
                    if (text.length > 14) {
                        return;
                    }
                    if (text && !text.match(/(\d|\-)+/g)) {
                        return;
                    }
                    setter(e.target.value.replace(/-/gi, ''))
                }}
            />
                <p className="small" style={{ marginTop: '0.5em' }}>개인정보 보호법 제24조의2(주민등록번호 처리의 제한)법령에 따라 지원금 지급시 원천징수를 목적으로 주민번호를 수집합니다.</p>
            </>
        case 'date':
            return <TextField
                margin="normal"
                fullWidth
                variant="outlined"
                label={label}
                type="date"
                value={value}
                InputLabelProps={{ shrink: true, }}
                onChange={e => {
                    setter(e.target.value)
                }}
            />
        case 'autocomplete-text':
            return <Autocomplete
                freeSolo
                options={options as string[]}
                value={value}
                onChange={(e, newValue) => {
                    setter(newValue)
                }}
                renderInput={(params) => (
                    <TextField {...params}
                        label={label}
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        value={value}
                        onChange={(e) => {
                            setter(e.target.value)
                        }}
                    />
                )}
            />
        case "address-post":
            return <FormControl variant="outlined" margin="normal" fullWidth>
                <InputLabel>{label}</InputLabel>
                <OutlinedInput
                    type="text"
                    value={value}
                    readOnly
                    onChange={e => setter(e.target.value)}
                    onClick={() => { addressFindOpener(true) }}
                    endAdornment={
                        value ? <InputAdornment position="end">
                            <IconButton
                                onClick={e => {
                                    setter('');
                                    addressSetter('');
                                    e.stopPropagation();
                                }}
                                edge="end"
                            >
                                <Close />
                            </IconButton>
                        </InputAdornment> : undefined
                    }
                    labelWidth={65}
                />
            </FormControl>;
        case "address":
            return <FormControl variant="outlined" margin="normal" fullWidth>
                <InputLabel>{label}</InputLabel>
                <OutlinedInput
                    type="text"
                    value={value}
                    readOnly
                    onChange={e => postalCodeSetter(e.target.value)}
                    onClick={() => { addressFindOpener(true) }}
                    endAdornment={
                        value ? <InputAdornment position="end">
                            <IconButton
                                onClick={e => {
                                    postalCodeSetter('');
                                    setter('');
                                    e.stopPropagation();
                                }}
                                edge="end"
                            >
                                <Close />
                            </IconButton>
                        </InputAdornment> : undefined
                    }
                    labelWidth={35}
                />
            </FormControl>
        case 'year':
            return <FormControl variant="outlined" margin="normal" fullWidth>
                <InputLabel>{label}</InputLabel>
                <OutlinedInput
                    labelWidth={190}
                    type="number"
                    value={value.toString()}
                    onChange={e => {
                        const number = parseInt(e.target.value);
                        if (!isNaN(number)) {
                            setter(number)
                        }
                    }}
                    endAdornment={<InputAdornment position="end">년</InputAdornment>}
                />
            </FormControl>
        case 'file':
            return <div>
                <p style={{ marginBottom: comment ? '0.5em' : undefined }}>{label}</p>
                {comment ? <p className="small" style={{ marginTop: 0 }}>{comment}</p> : undefined}
                <FileInput
                    label={label}
                    value={value}
                    uploadedValue={uploadedValue}
                    onFileChange={(file) => { fileSetter(file) }}
                    onUploadedValueChange={(url) => { uploadedValueSetter(url) }}
                />
            </div>
        case 'bank':
            return <div>
                <p style={{ marginBottom: comment ? '0.5em' : undefined }}>{label}</p>
                {comment ? <p className="small" style={{ marginTop: 0 }}>{comment}</p> : undefined}
                <TextField
                    margin="normal"
                    fullWidth
                    label={'은행'}
                    variant="outlined"
                    value={bank}
                    onChange={e => { bankSetter(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={'계좌번호'}
                    variant="outlined"
                    value={accountNumber}
                    onChange={e => {
                        const newValue = e.target.value;
                        const regex = /^(\d|-)*$/
                        console.log(regex.test(newValue))
                        if (regex.test(newValue)) {
                            accountNumberSetter(e.target.value)
                        }
                    }}
                />
                <FileInput
                    label={label}
                    value={value}
                    uploadedValue={uploadedValue}
                    onFileChange={(file) => { fileSetter(file) }}
                    onUploadedValueChange={(url) => { uploadedValueSetter(url) }}
                />
            </div>
    }
    return null;
}

const highestLevelOfEducationOptions = ['고졸(예정)', '대학 재학 중', '대학 졸업', '대학원 석사 재학 중', '대학원 석사 졸업', '대학원 박사 재학 중', '대학원 박사 졸업']

const sexOptions = [{ value: 'male', label: '남성' }, { value: 'female', label: '여성' }]

const admissionDateOptions = [
    { label: '2기 1차(2020년 06월)', value: moment('202006', 'YYYYMM').valueOf() }
];

const employmentStatusOptions = ["미취업자", "재직자", "개인사업자"]

const emergencyContactRelationOptions = ['부', '모']

function getDataKorLabel(dataKey: string): string {
    switch (dataKey) {
        case userDataKeys.profilePhoto:
            return '프로필 사진';
        case userDataKeys.identificationPhoto:
            return '신분증 사진';
        case userDataKeys.bankbookPhoto:
            return '통장 사진';
        // case userDataKeys.insurancePaymentHistoryPhoto:
        //     return '건강보험 납부 내역서 사진';
        case userDataKeys.residentRegistrationPhoto:
            return '주민등록 초본 사진';
        case userDataKeys.fourInsurancesPhoto:
            return '4대보험 가입 내역서 사진';
        case userDataKeys.etcEvidencePhoto:
            return '기타 증빙자료 사진';
    }
    return ''
}