
export const convertToCamelCase = (name) => {
    if (name == null || name === undefined) return;
    
    const words = name.split(' ')
    const camelCase = words.map( (word, index) => index === 0? word.toLowerCase() : word[0].toUpperCase() + word.slice(1).toLowerCase() )
                           .join('')
    
    return camelCase
  }
  

export const camelToCapitalizedWords = (str) => {
    return str.replace(/([A-Z])/g, ' $1') 
      .replace(/^./, (char) => char.toUpperCase()) 
      .trim()
  }
  
  export const capitalizeFirstLetter = (str)=> {
    if (!str || typeof str !== 'string') return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  