//Code to convert string or number values to boolean
const toBoolean = (dataStr:string) => {
    return !!(dataStr?.toLowerCase?.() === 'true' ||  Number.parseInt(dataStr, 10) === 1);
};

export default toBoolean;
