import { observable } from 'mobx';
import apis from '../apis';
import history from '../history';
import update from 'immutability-helper';

export type employmentStatusType = "미취업자" | "재직자" | "개인사업자" | "기타";

export interface StudentInfo {
    // "createdAt": string,
    // "id": number,
    // "updatedAt": string,
    // "photo": string,
    // "identificationPhoto": string,
    // "bankbookPhoto": string,
    "korName": string,
    "engName": string,
    "country": string,
    "birthday": string,
    "sex": "male" | "female" | "",
    "socialSecurityNumber": string,
    "postalCode": string,
    "address": string,
    "addressDetail": string,
    "phoneNumber": string,
    "emergencyContactName": string,
    "emergencyContactRelation": string,
    "emergencyContactPhoneNumber": string,
    "admissionDate": number | string,
    "highestLevelOfEducation": string,
    "major": string,
    city: string,
    softwareCareerYear: number,
    employmentStatus: employmentStatusType,
    termsOfUseAgreementAt?: number | null,
    personalInformationAgreementAt?: number | null,
    "accountNumber": string,
    "bank": string,
}

class User {
    @observable loginChecking: boolean = true;
    @observable logined: boolean = false;
    @observable email: string = '';
    @observable termsOfUseAgreementAt?: number | null = 0;
    @observable personalInformationAgreementAt?: number | null = 0;
    // @observable photos: { name: string, url: string }[] = [];
    // @observable studentInfo: StudentInfo | null = null;
    // @observable essay: { id: number, text: string }[] = [];

    checkLoginStatus = async () => {
        userSingleton.loginChecking = true;
        try {
            const response = await apis.getAccount();
            if (response.data.type !== 'student_42seoul') {
                alert('학생 계정만 로그인가능합니다.');
                try {
                    await apis.logout()
                } catch (error) {
                } finally {
                    this.logined = false;
                    this.email = ''
                }
            } else {
                this.saveAccount(response.data)
                this.logined = true;
                try {
                    const studentInfoRes = await apis.getStudentInfo();
                    if (studentInfoRes.data) {
                        this.termsOfUseAgreementAt = studentInfoRes.data.termsOfUseAgreementAt;
                        this.personalInformationAgreementAt = studentInfoRes.data.personalInformationAgreementAt;
                    }
                } catch (error) {
                    this.termsOfUseAgreementAt = null
                    this.personalInformationAgreementAt = null
                }
            }
            this.loginChecking = false;
        } catch (error) {
            this.logined = false;
            this.email = ''
            this.loginChecking = false;
            this.termsOfUseAgreementAt = null
            this.personalInformationAgreementAt = null
        }
    }

    logout = async () => {
        try {
            await apis.logout()
            userSingleton.logined = false;
            userSingleton.email = ''
            history.push('/signin');
        } catch (error) {
        }
    }

    saveAccount(accountData: any) {
        userSingleton.email = (accountData.email || '')
    }
}

const userSingleton = new User();
userSingleton.checkLoginStatus();

export default userSingleton;
