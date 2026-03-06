export const generateRandomPassword = (nbChar = 14): string => {
  let password = "";
  const acceptedChar = [
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "abcdefghijklmnopqrstuvwxyz",
    "0123456789",
    "@#$!*/",
  ];

  for (let i = 0; i < nbChar; i++) {
    const char = Math.floor(
      Math.random() * acceptedChar[i % acceptedChar.length].length
    );

    password += acceptedChar[i % acceptedChar.length].charAt(char);
  }

  return password;
};
