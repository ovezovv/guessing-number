const getRandomDecimal = () => {
  const a = (Math.random() * 8 + 1 + Math.random()).toFixed(2)

  return parseFloat(a);
}

const generatePoint = () =>  {
  const b = Math.floor(Math.random() * 1000) + 1; 
  return b
}
export {
  getRandomDecimal,
  generatePoint
}