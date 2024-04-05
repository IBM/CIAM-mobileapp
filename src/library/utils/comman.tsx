export const validate = (text: any) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (reg.test(text) === false) {
    return false;
  }
};
export const getRandomInt = () => {
  return Math.floor(1000 + Math.random() * 9000);
};
