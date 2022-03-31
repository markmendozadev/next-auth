import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(15);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const verifyPassword = (enteredPassword, dbPassword) => {
  const comparePassword = bcrypt.compare(enteredPassword, dbPassword);
  return comparePassword;
};
