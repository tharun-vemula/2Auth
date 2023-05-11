import { AccessControl } from 'accesscontrol';

const ac = new AccessControl();
ac.grant('user')
  .createOwn('profile')
  .deleteOwn('profile')
  .readOwn('profile')
  .grant('admin')
  .extend('user')
  .readAny('profile')
  .updateAny('profile')
  .deleteAny('profile');

export default ac;
