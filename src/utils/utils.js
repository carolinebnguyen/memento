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

export { formatDateDistanceToNow, formatDate };
