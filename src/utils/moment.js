import moment from 'moment';

// moment.tz.setDefault('Asia/Seoul');

const localTime = moment().format('YYYY-MM-DD HH:mm:ss');

export default { localTime };
