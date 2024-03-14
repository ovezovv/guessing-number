import { createUser, getUserByUsername } from "../models/User"

export const checkAndCreateUser = async (username: string) => {
  const user = await getUserByUsername(username);

  if(user){
    return user;
  } else {
    const newUser = await createUser({ username })

    return newUser
  }
}