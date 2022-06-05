import axios from "axios"
import axiosClient from "../../utils/axiosClient"
import catchErrors from "../../utils/catchErrors"
import { getToken } from "../../utils/storage"
import { hideLoading, showLoading } from "../actions/loadingActions"
import { types } from "../types"
import { getUserLK } from "./usersAsync"

export const getDetailProject = async (id, dispatch) => {
    try {
        dispatch && dispatch(showLoading());
        const { data } = await axiosClient.get(`/api/v1/projects/${id}`, {
            headers: {
                "Content-type": "application/json",
            }
        })
        return data;
    } catch (error) {
        catchErrors(error);
    } finally {
        dispatch && dispatch(hideLoading());
    }
}

export const getProjects = async ({ param_url, dispatch, toStore }) => {
    try {
        dispatch && dispatch(showLoading());
        const url = param_url || '/api/v1/projects/';
        const { data } = await axiosClient.get(url, {
            headers: {
                "Content-type": "application/json",
            }
        })
        toStore && dispatch({
            type: types.setProjects,
            payload: data
        })
        return data;
    } catch (error) {
        catchErrors(error);
    } finally {
        dispatch && dispatch(hideLoading());
    }
}

export const getRecomendationsProjects = async ({ arr, dispatch }) => {
    try {
        dispatch && dispatch(showLoading());
        const { data } = await axiosClient.post('/api/v1/projects/recomendations/', { recomendations: arr.split(' ').map(id => +id) }, {
            headers: {
                "Content-type": "application/json",
            }
        })
        return data;
    } catch (error) {
        catchErrors(error);
    } finally {
        dispatch && dispatch(hideLoading());
    }
}

export const getArticles = () => {
    return async dispatch => {
        try {
            dispatch(showLoading());
            const url = '/api/v1/main/articles/';
            const { data } = await axiosClient.get(url, {
                headers: {
                    "Content-type": "application/json",
                }
            })
            dispatch({
                type: types.setArticles,
                payload: data
            })
        } catch (error) {
            catchErrors(error);
        } finally {
            dispatch(hideLoading());
        }
    }
}

export const getVacancies = async dispatch => {
    try {
        dispatch && dispatch(showLoading());
        const url = '/api/v1/projects/vacancies/';
        const { data } = await axiosClient.get(url, {
            headers: {
                "Content-type": "application/json",
            }
        })
        return data
    } catch (error) {
        catchErrors(error);
    } finally {
        dispatch && dispatch(hideLoading());
    }
}

export const getCategories = () => {
    return async dispatch => {
        try {
            dispatch(showLoading())
            const { data } = await axiosClient.get('/api/v1/projects/category', {
                headers: {
                    "Content-type": "application/json",
                }
            })
            dispatch({
                type: types.setCategories,
                payload: data
            })
        } catch (error) {
            catchErrors(error);
        } finally {
            dispatch(hideLoading());
        }
    }
}

export const getCategoryProjects = async (category, dispatch) => {
    try {
        dispatch(showLoading())
        const { data } = await axiosClient.get(`/api/v1/projects/category/${category}`, {
            headers: {
                "Content-type": "application/json",
            }
        })
        return data;
    } catch (error) {
        catchErrors(error);
    } finally {
        dispatch(hideLoading());
    }
}

export const getFieldsProject = async (dispatch) => {
    try {
        dispatch && dispatch(showLoading());
        const token = getToken()
        if (token) {
            const { data } = await axiosClient.get(`/api/v1/projects/fields`, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
            // console.log("fieldsfieldsfields", data);
            return data;
        }
    } catch (error) {
        catchErrors(error);
    } finally {
        dispatch && dispatch(hideLoading());
    }
}

export const predictSuccess = async (projectData, dispatch) => {
    try {
        dispatch && dispatch(showLoading());
        const { data } = await axios.post(`http://78.24.217.40:8050/predict_proba`, projectData, {
            headers: {
                "Content-type": "application/json",
            }
        })
        return data;
    } catch (error) {
        catchErrors(error);
    } finally {
        dispatch && dispatch(hideLoading());
    }
}

export const getRecommendations = async (userActivity, dispatch, bigData = false) => {
    try {
        dispatch && dispatch(showLoading());
        const url = bigData ? 'http://78.24.217.40:8050/predict_projects_big' : 'http://78.24.217.40:8050/predict_projects'
        const { data } = await axios.post(url, userActivity, {
            headers: {
                "Content-type": "application/json",
            }
        })
        return data;
    } catch (error) {
        catchErrors(error);
    } finally {
        dispatch && dispatch(hideLoading());
    }
}


export const updateProject = (project, cb) => {
    return async dispatch => {
        try {
            dispatch(showLoading());
            const token = getToken();
            if (token) {
                const formData = new FormData();
                Object.keys(project).forEach(field => {
                    formData.append(field, project[field]);
                })
                const { data } = await axiosClient.put(`/api/v1/projects/update/${project.id}`, formData, {
                    headers: {
                        "Content-type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    }
                })
                cb && cb(data.id);
            }
        } catch (error) {
            catchErrors(error);
        } finally {
            dispatch(hideLoading());
        }
    }
}

export const createPost = (createData, cb, type, userID, updateCb) => {
    return async dispatch => {
        try {
            dispatch(showLoading());
            const token = getToken();
            if (token) {
                const formData = new FormData();
                Object.keys(createData).forEach(field => {
                    formData.append(field, createData[field]);
                })
                const url = type ?
                    '/api/v1/projects/create/' + type
                    :
                    '/api/v1/projects/create/';
                const { data } = await axiosClient.post(url, formData, {
                    headers: {
                        "Content-type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    }
                })
                cb && userID && dispatch(cb(userID));
                cb && !userID && cb(data.id);
                updateCb && updateCb();
            }
        } catch (error) {
            catchErrors(error);
        } finally {
            dispatch(hideLoading());
        }
    }
}


export const deleteProject = (id) => {
    return async dispatch => {
        try {
            dispatch(showLoading())
            const token = getToken();
            if (token) {
                await axiosClient.delete(`/api/v1/projects/delete/${id}`, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                })
                dispatch({
                    type: types.deleteProject,
                    payload: id
                })
            }
        } catch (error) {
            catchErrors(error);
        } finally {
            dispatch(hideLoading());
        }
    }
}

// export const getLikes = (id) => {
//     return async dispatch => {
//         try {
//             dispatch(showLoading())
//             const token = getToken()
//             if (token) {
//                 await axiosClient.delete(`/api/v1/projects/delete/${id}`, {
//                     headers: {
//                         "Content-type": "application/json",
//                         Authorization: `Bearer ${token}`
//                     }
//                 })
//                 dispatch({
//                     type: types.deleteProject,
//                     payload: id
//                 })
//             }
//         } catch (error) {
//             catchErrors(error);
//         } finally {
//             dispatch(hideLoading());
//         }
//     }
// }

export const CRUDProjectDependencies = async ({ dispatch, type, id, user, method, dataForEdit, cb }) => {
    try {
        dispatch && dispatch(showLoading());
        const token = getToken()
        if (token) {
            const formData = new FormData();
            if (dataForEdit) {
                Object.keys(dataForEdit).forEach(field => {
                    formData.append(field, dataForEdit[field]);
                })
            }
            const { data } = await axiosClient({
                method,
                url: id ? `/api/v1/projects/${type}/${id}` : `/api/v1/projects/${type}/`,
                data: dataForEdit,
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
            // console.log(data);
            dispatch && user && dispatch(getUserLK(user.id));
            dispatch && cb && cb();
            return data;
        } else throw new Error('Вы не авторизованы !');
    } catch (error) {
        catchErrors(error);
    } finally {
        dispatch && dispatch(hideLoading());
    }
}



   // const fieldsWithDefaultValues = Object.keys(data).reduce((acc, curr) => {
            //     const fieldInfo = {};
            //     // if (data[curr].data)
            //     //     fieldInfo.data = data[curr].data;

            //     // if (data[curr].default)
            //     //     fieldInfo.default = data[curr].default;

            //     // if (data[curr].choices)
            //     //     fieldInfo.choices = data[curr].choices;

            //     // for (let key in fieldInfo) {
            //     //     return { ...acc, [curr]: fieldInfo }
            //     // }

            //     return { ...acc, [curr]: data[curr] };
            // }, {})
            // // dispatch({
            // //     type: types.setFieldsProject,
            // //     payload: fieldsWithDefaultValues
            // // })