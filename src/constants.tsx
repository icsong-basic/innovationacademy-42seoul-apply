import utils from "./utils";

export const userDataKeys = {
    profilePhoto: '프로필사진',
    identificationPhoto: '신분증사진',
    bankbookPhoto: '통장사진',
    residentRegistrationPhoto: '주민등록초본',
    fourInsurancesPhoto: '4대보험가입내역서',
    etcEvidencePhoto: '기타증빙자료',
}

export const agreementPostId = { boardId: 10, postId: utils.isProduction() ? 31 : 57 };
export const privacyPolicyId = { boardId: 10, postId: utils.isProduction() ? 32 : 58 };