import countries from 'i18n-iso-countries';
import countriesKo from 'i18n-iso-countries/langs/ko.json';
import countriesEn from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(countriesKo);
countries.registerLocale(countriesEn);
const countriesEnNames = countries.getNames('en');
const countriesKoNames = countries.getNames('ko');
// countriesEnNames["KR"] = "Republic of Korea";

export default {
    en: countriesEnNames,
    ko: countriesKoNames
};