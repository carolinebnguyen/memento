import { formatDistanceToNow } from 'date-fns';
import { format } from 'date-fns-tz';

const formatDateDistanceToNow = (dateToFormat) => {
  return formatDistanceToNow(dateToFormat, {
    addSuffix: true,
  });
};

const formatDate = (dateToFormat) => {
  return format(dateToFormat, 'PPPPPp (z)', {
    timeZone: 'America/Los_Angeles',
  });
};

/*
Minimum 8 characters
- At least one lower case alphabetic
- At least one upper case alphabetic
- At least one number
- At least one special character
*/
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const passwordErrorMessage = `Password requires:
- at least 8 characters
- at least 1 lowercase letter
- at least 1 uppercase letter
- at least 1 symbol
- at least 1 number`;

const NotificationType = {
  LIKE: 'like',
  FOLLOW: 'follow',
  COMMENT: 'comment',
};

export {
  formatDateDistanceToNow,
  formatDate,
  passwordRegex,
  passwordErrorMessage,
  NotificationType,
};
