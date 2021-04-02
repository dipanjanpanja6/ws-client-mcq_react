import { AUTH, USERINFO } from '../type';
import { server } from '../../config/server'
import { Firebase } from '../../config/firebase';

export const checkUser = () => (dispatch) => {
    fetch(`${server}/account/checkUser`, {
        method: 'GET',
        credentials: 'include',
    }).then(res => res.json().then((d) => {
        if (d.success === true) {
            // console.log(d);
            dispatch({
                type: AUTH,
                payload: { auth: true, type: d.userType },
            });
            dispatch({
                type: USERINFO,
                payload: { ...d.userInfo },
            });

        } else if (d.error === true) {
            console.log(d.message);
            // d.message === 'app/network-error' &&
            // toast.error('server offline ! please contact team');
            dispatch({
                type: AUTH,
                payload: { auth: false, type: "" },
            });
        }
    })).catch((r) => {
        console.log(r);
        dispatch({
            type: AUTH,
            payload: { auth: false, type: "" },
        });

    });
};
export const logout = () => (dispatch) => {
    Firebase.analytics().logEvent('logout');

    fetch(`${server}/account/logout`, {
        method: 'DELETE',
        credentials: 'include',
    }).then((res) => {
        res.json().then((d) => {
            // console.log(d);
            if (d.success === true) {
                dispatch({
                    type: AUTH,
                    payload: { auth: false, type: "" },
                });

            }
        }).catch((r) => console.log(r));
    });
};