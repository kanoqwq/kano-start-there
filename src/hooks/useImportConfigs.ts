export type Options = {
    maxUploadSize?: number
}

export type returnType = Promise<{
    msg: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    data: any
}>

export const useImportConfigs = ({ maxUploadSize }: Options) => {
    const MAX_UPLOAD_SIZE = maxUploadSize ? maxUploadSize : 3
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
                    reader.readAsText(file); // 将文件读取为Data URL
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    reader.onload = (e: any) => {
                        const text =e.target.result;
                        resolve({ msg: 'ok', data: text })
                    };
                }
            }
        })

    };
    return {
        change
    }
}