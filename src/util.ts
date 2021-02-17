

export function createTokenValidator(length: number): ((token: string) => boolean) {
    const regex = new RegExp(`^([0-9abcdef]){${length}}$`, 'i');
    return regex.test.bind(regex)
}


export function createTokenGenerator(length: number): (() => string) {
    const characters = 'abcdef0123456789';
    return () => {
        let result = '';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
