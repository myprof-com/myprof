import api from '../api/api';
import { useEffect, useReducer } from 'react';

export const FetchState = {
    FETCH_INIT: 0,
    FETCH_SUCCESS: 1,
    FETCH_FAILURE: 2,
};

export const useGetProfReviews = (stale) => {
    const reducer = (state, action) => {
        switch (action.type) {
            case FetchState.FETCH_INIT:
                return { ...state, isLoading: true, isError: false };
            case FetchState.FETCH_SUCCESS:
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    profReviews: action.payload,
                };
            case FetchState.FETCH_FAILURE:
                return { ...state, isLoading: false, isError: true };
            default:
                throw new Error();
        }
    };

    const [state, dispatch] = useReducer(reducer, {
        isLoading: false,
        isError: false,
        profReviews: [],
    });

    useEffect(() => {
        let didCancel = false;
        const getProfReviews = async () => {
            dispatch({ type: FetchState.FETCH_INIT });
            try {
                const data = await api.listProf(
                    process.env.PROFESSOR_COLLECTION_ID
                );
                if (!didCancel) {
                    dispatch({
                        type: FetchState.FETCH_SUCCESS,
                        payload: data.documents,
                    });
                }
            } catch (e) {
                if (!didCancel) {
                    dispatch({ type: FetchState.FETCH_FAILURE });
                }
            }
        };
        getProfReviews();
        return () => (didCancel = true);
    }, [stale]);

    return [stale];
};

export const useGetUser = () => {
    const reducer = (state, action) => {
        switch (action.type) {
            case FetchState.FETCH_INIT:
                return { ...state, isLoading: true, isError: false };
            case FetchState.FETCH_SUCCESS:
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    user: action.payload,
                };
            case FetchState.FETCH_FAILURE:
                return { ...state, isLoading: false, isError: true };
            default:
                throw new Error();
        }
    };

    const [state, dispatch] = useReducer(reducer, {
        isLoading: false,
        isError: true,
        data: [],
    });

    useEffect(() => {
        let didCancel = false;
        const getUser = async () => {
            dispatch({ type: FetchState.FETCH_INIT });
            try {
                const account = await api.getAccount();
                if (!didCancel) {
                    dispatch({
                        type: FetchState.FETCH_SUCCESS,
                        payload: account,
                    });
                }
            } catch (e) {
                if (!didCancel) {
                    dispatch({ type: FetchState.FETCH_FAILURE });
                }
            }
        };
        getUser();
        return () => (didCancel = true);
    }, []);

    return [state, dispatch];
};
