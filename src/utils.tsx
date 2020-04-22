export default {
    formatSocialSecurityNumber(text: string) {
        const regex = (/^(\d\d\d\d\d\d)(\d+)$/g);
        if (text.match(regex)) {
            const result = regex.exec(text)
            if (result)
                return `${result[1]}-${result[2]}`;
        }
        return text;
    },
    isProduction: () => {
        return window.location.hostname === "profile.42seoul.kr"
    }
}