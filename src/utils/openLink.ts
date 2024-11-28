
export function openWithoutReferrer(url: string) {
    const oDate = new Date();
    window.open('javascript:window.name', `<script>location.replace("${url}")<\/script>${oDate.getTime()}`);
}