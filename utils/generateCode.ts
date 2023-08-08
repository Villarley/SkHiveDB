export const generateRandomCode = ():string =>{
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
  
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
  
    return code;
}