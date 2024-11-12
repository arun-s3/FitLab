
export const convertToCamelCase = (name) => {
    if(name == null||undefined) return
    const spaceIndex = name.indexOf(' ')
    if (spaceIndex === -1) return name
    const firstWord = name.slice(0, spaceIndex);
    const secondWord = name.slice(spaceIndex + 1);
    return firstWord + secondWord[0].toUpperCase() + secondWord.slice(1);
}

export const camelToCapitalizedWords = (str)=> {
    return str .replace(/([A-Z])/g, ' $1') .replace(/^./, str[0].toUpperCase()) .replace(/\b\w/g, char => char.toUpperCase()) .trim();
}
