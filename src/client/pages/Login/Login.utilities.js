// utils
import { signIn } from '../../utils/firebase.utils';
import catchify from '../../utils/catchify.util';
import { getStorage, removeStorage } from '../../utils/localStorage.utils';

export const handleRedirect = (history) => {
    const redirectPath = getStorage('loginRedirect');

    history.push(redirectPath || '/');

    if (redirectPath) removeStorage('loginRedirect');
};

export function handleSubmit({ email, password }, handleError, setLoading, history) {
    return async (event) => {
        event.preventDefault();
        console.log('username:', email);
        setLoading(true);
        const [error, result] = await catchify(signIn(email, password));

        if (error) {
            handleError('Email and/or password incorrect. Please try again.');
            setLoading(false);
            return false;
        }

        handleRedirect(history);
        return result;
    };
}

// export function isDisabled(fieldsValue, fieldsError) {
//     const requiredEmpty = Object.values(fieldsValue).some(field => typeof field === 'undefined');
//     const hasError = Object.values(fieldsError).some(message => typeof message !== 'undefined');
//
//     return requiredEmpty || hasError;
// }
