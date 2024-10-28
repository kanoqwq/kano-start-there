export type Options = {
    emit: (event: any, ...args: any) => any,
    maxUploadSize?: number
}

export type returnType = Promise<{
    msg: string,
    data: any
}>

export const useUploadImage = ({ emit, maxUploadSize }: Options) => {
    const MAX_UPLOAD_SIZE = maxUploadSize ? maxUploadSize : 3
    const change = (event: any): returnType => {
        return new Promise((resolve, reject): void => {
            const file = event.target.files[0];
            if (file) {
                // 检查文件大小
                if (file.size > MAX_UPLOAD_SIZE * 1024 * 1024) {
                    // 3MB
                    reject({ msg: `文件大小不能超过${MAX_UPLOAD_SIZE}MB！`, data: null })
                } else {
                    const reader = new FileReader();
                    reader.readAsDataURL(file); // 将文件读取为Data URL
                    reader.onload = function (e: any) {
                        const base64String = e.target.result;
                        // console.log(base64String); // 输出Base64字符串
                        emit('success');
                        resolve({ msg: 'ok', data: base64String })
                    };
                }
            }
        })

    };
    return {
        change
    }
}