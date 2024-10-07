const alpha = 'qwertyuiopasdfghjklzxcvbnm';
export const generateUUID = (): string => {
  return alpha[Math.floor(Math.random() * 26)];
} 
console.log('New uuid: ', generateUUID());