const usPhone = "(###) ###-####";

export const formatNumber = (value, format = usPhone) => {
  let formattedValue = "";
  const valueStack = value.split("").reverse(); // Create a stack of the values
  // iterate over the format
  for (let i = 0; i < format.length && valueStack.length; i++) {
    if (format[i] === "#") {
      formattedValue += valueStack.pop();
    } else {
      formattedValue += format[i];
    }
  }
  return formattedValue;
};

const isNumber = (character) => !!character.match(/\d/);

export const unFormatNumber = (formattedValue) =>
  formattedValue.split("").filter(isNumber).join("");

console.log(formatNumber("4"), "(4");
console.log(formatNumber("415"), "(415");
console.log(formatNumber("4152"), "(415) 2");
console.log(formatNumber("4152008333"), "(415) 200-8333");
console.log(unFormatNumber("(415) 200-8333"), "4152008333");
