import axiosClient from "../../utils/axiosClient"
import catchErrors from "../../utils/catchErrors"
import { getToken } from "../../utils/storage"
import { hideLoading, showLoading } from "../actions/loadingActions"
import { types } from "../types"

export const getUserInfo = async (dispatch, token) => {
    try {
        const sendToken = token || getToken();
        const { data } = await axiosClient.get('/api/v1/users/auth/users/me/', {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${sendToken}`
            }
        });
        dispatch && dispatch({
            type: types.login,
            payload: { isAuthenticated: true, ...data },
        });
        return data;
    } catch (error) {
        catchErrors(error);
    }
}

export const loginAsyncUser = async (dispatch, userData, cb) => {
    try {
        dispatch(showLoading());
        const { data } = await axiosClient.post('/api/v1/users/token/', { ...userData });
        localStorage.setItem('accessToken', JSON.stringify(data.access));
        localStorage.setItem('refreshToken', JSON.stringify(data.refresh));
        const user = await getUserInfo(dispatch, data.access);
        localStorage.removeItem('register');

        if (user && user.id) {
            const activity = localStorage.getItem(`userActivity_${user.id}`)
            if (!activity) {
                dispatch(RUDactivity({
                    method: 'get', activityData: { user: user.id }
                }))
            }
        }
        dispatch(hideLoading());
        cb && cb()
    } catch (error) {
        catchErrors(error);
    } finally {
        dispatch(hideLoading());
    }
}

export const loginUser = (userData, cb) => {
    return async dispatch => {
        await loginAsyncUser(dispatch, userData, cb);
    }
}

export const refreshToken = (refresh, cb) => {
    return async dispatch => {
        try {
            if (refresh) {
                const { data } = await axiosClient.post('/api/v1/users/token/refresh/', { refresh });
                localStorage.setItem('accessToken', JSON.stringify(data.access));
                await getUserInfo(dispatch, data.access);
                // const user =
                // dispatch({
                //     type: types.login,
                //     payload: { isAuthenticated: true, ...user },
                // })
                cb && cb();
            }
            else throw 'Нет токена refresh';
        } catch (error) {
            catchErrors(error);
            localStorage.getItem("refreshToken") && localStorage.removeItem('refreshToken');
            dispatch({ type: types.logout })
        } finally {
            dispatch(hideLoading());
        }
    }
}

export const asyncVarifyToken = (cb) => {
    return async dispatch => {
        try {
            dispatch(showLoading());
            const token = getToken(); // storageToken
            // const token = storageToken && JSON.parse(storageToken);
            const isVarify = await axiosClient.post('/api/v1/users/token/varify/', { token });
            if (isVarify) {
                await getUserInfo(dispatch);
                dispatch(hideLoading());
                // cb && cb();
            } else throw 'Срок действия токена истек !';
        } catch (error) { // обновлять токен, а не удалять. Если истек срок refresh, то logout. 
            // Посмотреть как лучше отлавливать ошибки axios post
            // console.log("varifyToken", error);
            // catchErrors(error);
            localStorage.removeItem('accessToken');
            const storageToken = localStorage.getItem('refreshToken');
            const refresh = storageToken && JSON.parse(storageToken);
            await dispatch(refreshToken(refresh, cb));
        }
    }
}

export const varifyToken = (cb) => {
    return async dispatch => {
        await dispatch(asyncVarifyToken(cb));
    }
}

export const logoutUser = () => {
    return async (dispatch, getState) => {
        try {
            // dispatch(showLoading());
            const { user } = getState()
            if (user && user.id) {
                const storageName = `userActivity_${user.id}`
                const activity = localStorage.getItem(storageName)
                if (activity) {
                    dispatch(RUDactivity({
                        method: 'patch',
                        activityData: {
                            user: user.id,
                            activity
                        },
                        cb: () => {
                            localStorage.removeItem(storageName)
                        }
                    }))

                }
            }
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            dispatch({
                type: types.logout,
            })
        } catch (error) {
            catchErrors(error);
        }
    }
}

export const registerUser = (userData, navigate) => {
    return async dispatch => {
        try {
            dispatch(showLoading());
            await axiosClient.post('/api/v1/users/auth/users/', { ...userData });
            localStorage.setItem('register', JSON.stringify(userData))
            navigate('/')
        } catch (error) {
            catchErrors(error);
        } finally {
            dispatch(hideLoading());
        }
    }
}

export const isAuthRedux = () => {
    return async dispatch => {
        try {
            dispatch(showLoading())
            const token = getToken()

            if (token) {
                const { data } = await axiosClient.get('/api/users/verify', {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                })

                dispatch({
                    type: types.updateUserStatus,
                    payload: data.isAuthenticated
                })
            }
            dispatch(hideLoading())
        } catch (error) {
            localStorage.removeItem('accessToken')
            catchErrors(error);
        } finally {
            dispatch(hideLoading())
        }
    }
}

export const getUserLK = (user_id) => {
    return async dispatch => {
        try {
            dispatch(showLoading())
            const token = getToken()
            if (token) {
                const userInfo = await axiosClient.get(`/api/v1/users/lk/${user_id}`, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                const supervisorProjects = await axiosClient.get(`/api/v1/projects/lk/supervisor/${user_id}`, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                // const participationProjects = await axiosClient.get(`/api/v1/projects/lk/participation/?members=${user_id}`, {
                //     headers: {
                //         "Content-type": "application/json",
                //         Authorization: `Bearer ${token}`
                //     }
                // });
                // const applicationsProjects = await axiosClient.get(`/api/v1/projects/lk/participation/?applications=${user_id}`, {
                //     headers: {
                //         "Content-type": "application/json",
                //         Authorization: `Bearer ${token}`
                //     }
                // });


                // const all = [...supervisorProjects.data, ...participationProjects.data]
                // let uniqueProject = [];
                // all.forEach((element) => {
                // if (!uniqueProject.includes(element)) {
                //     uniqueProject.push(element);
                // }
                // });
                // console.log(uniqueProject, all);
                dispatch({
                    type: types.setUserLK,
                    payload: userInfo.data
                })
                dispatch({
                    type: types.setUserProjectsLK,
                    payload: supervisorProjects.data
                })
                // dispatch({
                //     type: types.setUserTeamsLK,
                //     payload: participationProjects.data
                // })
                // dispatch({
                //     type: types.setUserApplicationsLK,
                //     payload: applicationsProjects.data
                // })
            } else throw 'Срок действия токена истек !';
        }
        catch (error) {
            catchErrors(error);
        } finally {
            dispatch(hideLoading())
        }
    }
}

export const getUsers = () => {
    return async dispatch => {
        try {
            dispatch(showLoading())
            const token = getToken()

            if (token) {
                const { data } = await axiosClient.get('/api/v1/users/', {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                })
                dispatch({
                    type: types.setUsers,
                    payload: data
                })
            }
        } catch (error) {
            catchErrors(error);
        } finally {
            dispatch(hideLoading())
        }
    }
}

export const activateUser = async (activateData, dispatch) => {
    try {
        if (activateData) {
            await axiosClient.post('/api/v1/users/auth/users/activation/', { ...activateData }, {
                headers: {
                    "Content-type": "application/json",
                }
            })
            const userData = localStorage.getItem('register')
            if (userData) {
                const { email, password } = JSON.parse(userData)
                dispatch(loginUser({ email, password }));
                //, () => navigate("/", { replace: true }) // replace - не записывать в историю пред. роут (т.е страницу логина)
                // dispatch && dispatch({
                //     type: types.activateUser,
                // })
            }
        }
    } catch (error) {
        catchErrors(error);
        throw error
    }
}

export const resendActivation = async (email, dispatch) => {
    try {
        if (email) {
            await axiosClient.post('/api/v1/users/auth/users/resend_activation/', { email }, {
                headers: {
                    "Content-type": "application/json",
                }
            })
            dispatch && dispatch({
                type: types.activateUser,
            })
        }
    } catch (error) {
        catchErrors(error);
        throw error
    }
}

export const updateUser = (user, cb) => {
    return async dispatch => {
        try {
            dispatch(showLoading());
            const token = getToken();
            if (token) {
                const formData = new FormData();
                Object.keys(user).forEach(field => {
                    formData.append(field, user[field]);
                })
                const { data } = await axiosClient.patch(`/api/v1/users/auth/users/me/`, formData, {
                    headers: {
                        "Content-type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log(data);
                dispatch && dispatch({
                    type: types.updateUser,
                    payload: data
                })
                dispatch && dispatch({
                    type: types.updateUserLK,
                    payload: data
                })
                cb && cb();
            }
        } catch (error) {
            catchErrors(error);
        } finally {
            dispatch(hideLoading());
        }
    }
}

export const findUsers = async (query, dispatch) => {
    try {
        dispatch && dispatch(showLoading())
        const { data } = await axiosClient.get(`/api/v1/users/find/?search=${query}`, {
            headers: {
                "Content-type": "application/json",
            }
        })
        return data;
    } catch (error) {
        catchErrors(error);
    } finally {
        dispatch && dispatch(hideLoading())
    }
}

export const createActivity = (activityData) => {
    return async dispatch => {
        try {
            const token = getToken();
            if (token) {
                const url = '/api/v1/users/create/activity/'
                const { data } = await axiosClient.post(url, activityData, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log(data);
            }
        } catch (error) {
            catchErrors(error);
        }
    }
}

export const RUDactivity = ({ activityData, method, cb }) => {
    return async dispatch => {
        try {
            dispatch(showLoading());
            const token = getToken();
            if (token) {
                const { user } = activityData
                if (user) {
                    const url = `/api/v1/users/activity/${user}`
                    const { data } = await axiosClient({
                        method,
                        url,
                        data: activityData || {},
                        headers: {
                            "Content-type": "application/json",
                            // Authorization: `Bearer ${token}`
                        }
                    })
                    cb && cb()
                    method === 'get' && data && localStorage.setItem(`userActivity_${user}`, data.activity)
                    console.log(data);
                }
            }
        } catch (error) {
            catchErrors(error);
        } finally {
            dispatch(hideLoading());
        }
    }
}