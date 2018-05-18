



export function getISODate(date: Date)
{
    return `${leftPad('0', date.getFullYear(), 4)}-${leftPad('0', date.getMonth() + 1, 2)}-${leftPad('0', date.getDate(), 2)}`;
}

export function leftPad(str: string, value: number, length: number)
{
    let strValue = value.toString();
    while (strValue.length < length)
    {
        strValue = str + strValue;
    }
    return strValue;
}