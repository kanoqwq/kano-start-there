
export function openWithoutReferrer(url: string) {
    var oDate = new Date();
    window.open('javascript:window.name', '<script>location.replace("' + url + '")<\/script>' + oDate.getTime());
}