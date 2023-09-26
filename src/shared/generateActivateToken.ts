import { jwtHelpers } from '../helpers/jwtHelpers';
import { Secret } from 'jsonwebtoken';
import config from '../config';
import { IUser } from '../app/modules/user/user.interface';

const generateActivateToken = (user: IUser) => {
  const activationLink = jwtHelpers.createToken(
    { user },
    config.jwt.active_link_secret as Secret,
    config.jwt.active_link_expires_in as string
  );

  return { activationLink };
};

export default generateActivateToken;
