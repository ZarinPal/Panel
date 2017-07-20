export default {
    /**
     * @param number => farsi
     * @returns {number} => english
     */
    faToEn(number) {
        let farsiValue = number.replace(/,/g, "");
        return Number( farsiValue.replace(/[٠١٢٣٤٥٦٧٨٩]/g, function(d) {
            return d.charCodeAt(0) - 1632;
        }).replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function(d) {
            return d.charCodeAt(0) - 1776;
        }));
    }
}