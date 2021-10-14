import { generate as uuid } from 'shortid';
import { notification } from 'antd';
// utils
import catchify from '../../../utils/catchify.util';
import { store as db } from '../../../../js/utils/fireDB';
import { isEmpty } from '../../../utils/data.utils';
import { utc } from '../../../utils/date.utils';

const trimData = (list) => list.filter((item) => !!item);
const cleanData = ({ devotional, activity, overnight, instructions }) => ({
    devotional: trimData(devotional),
    activity: trimData(activity),
    overnight: trimData(overnight),
    instructions: instructions ? instructions.trim() : '',
});

export const handleSubmit = async (data, set) => {
    const uid = uuid();
    const [error] = await catchify(
        db
            .collection('youthConference')
            .doc(uid)
            .set({
                ...cleanData(data),
                uid,
                createdDate: utc(),
            })
    );

    if (error) return set({ errorMessage: 'Oh nuts. Something went wrong. Please try again.' });

    notification.success({
        message: 'Success',
        description: 'You are signed up',
    });
    set({ devotional: [''], activity: [''], overnight: [''], instructions: '', errorMessage: '' });
};

export const insertValueToArray = (list, index, value) => {
    list.splice(index, 1, value);
    return list;
};

export const removeValueToArray = ({ devotional, activity, overnight }, index, set) => {
    devotional.splice(index, 1);
    activity.splice(index, 1);
    overnight.splice(index, 1);

    set({ devotional, activity, overnight });
};

export const handleDisable = ({ devotional, activity, overnight }) => {
    const devot = isEmpty(devotional.filter((item) => !!item));
    const act = isEmpty(activity.filter((item) => !!item));
    const over = isEmpty(overnight.filter((item) => !!item));

    return devot && act && over;
};
