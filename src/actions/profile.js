import { FAIRSHOTS_API } from "./constants";
import { sendPhotoGetUrl } from "./photo-actions";
import toggleLoading from "./toggleLoading";

export function getProfile(userType, id, token, thirdParty = false) {
    return async dispatch => {
        dispatch(toggleLoading());
        const config = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${token}`
            }
        };
        try {
            console.log(id);
            const res = await fetch(`${FAIRSHOTS_API}api/${userType}/${id}`, config);
            if (res.ok) {
                const userProfile = await res.json();
                if (!thirdParty) {
                    dispatch({
                        type: "GET_PROFILE",
                        payload: userProfile
                    });
                    dispatch({
                        type: "AUTH_PROFILE_THUMBNAIL",
                        payload: { thumbnail: userProfile.ProfilePic || userProfile.Logo }
                    });
                } else if (userType === "photographer") {
                    dispatch({
                        type: "GET_ONEFROMALLPHOTOGRAPHERS",
                        payload: userProfile
                    });
                } else {
                    dispatch({
                        type: "GET_ONEFROMALLORGS",
                        payload: userProfile
                    });
                }
                dispatch(toggleLoading());
            } else throw await res.text();
        } catch (e) {
            dispatch({
                type: "PROFILE_ERROR",
                payload: e
            });
            dispatch(toggleLoading());
        }
    };
}

export function getOneFromAll(userType, id) {
    return async dispatch => {
        dispatch(toggleLoading());
        const config = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const res = await fetch(`${FAIRSHOTS_API}api/${userType}/all/${id}`, config);
            if (res.ok) {
                const userProfile = await res.json();
                console.log(userProfile);
                dispatch({
                    type: "GET_ONEFROMALLPHOTOGRAPHERS",
                    payload: userProfile
                });
                dispatch(toggleLoading());
            } else throw res;
        } catch (e) {
            console.log(e.toString());
            dispatch({
                type: "allPhotographers_ERROR",
                payload: e.statusText !== undefined ? e.statusText : e.toString()
            });
            dispatch(toggleLoading());
        }
    };
}

export function toggleActivateProfile(userType, id, token, currentStatus) {
    return async dispatch => {
        dispatch(toggleLoading());
        console.log(`turning to ${!currentStatus}`);
        const config = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${token}`
            },
            body: JSON.stringify({
                accountInactive: !currentStatus
            })
        };
        try {
            const res = await fetch(`${FAIRSHOTS_API}api/${userType}/${id}`, config);
            if (res.ok) {
                const message = await res.json();
                if (message.msg.match(/inactive/gi)) {
                    dispatch({
                        type: "INACTIVATE_PROFILE",
                        payload: message
                    });
                } else if (message.msg.match(/reactivate/gi)) {
                    dispatch({
                        type: "REACTIVATE_PROFILE",
                        payload: message
                    });
                }
                dispatch(toggleLoading());
            } else throw res;
        } catch (e) {
            console.log(e.toString());
            dispatch({
                type: "PROFILE_ERROR",
                payload: e.statusText !== undefined ? e.statusText : e.toString()
            });
            dispatch(toggleLoading());
        }
    };
}

export function update(userType, id, formProps, token) {
    return async dispatch => {
        dispatch(toggleLoading());
        const config = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${token}`
            }
        };
        try {
            let imgRes = "";
            let updateForm;
            if (formProps.ProfilePic || formProps.Logo) {
                if (userType === "photographer") {
                    imgRes = await sendPhotoGetUrl(formProps.ProfilePic[0], "lsofhgqb");
                    updateForm = {
                        ...formProps,
                        ProfilePic: imgRes.secure_url
                    };
                    config.body = JSON.stringify(updateForm);
                } else {
                    imgRes = await sendPhotoGetUrl(formProps.Logo[0], "lsofhgqb");
                    updateForm = {
                        ...formProps,
                        Logo: imgRes.secure_url,
                        funding: formProps.funding === "Yes"
                    };
                    config.body = JSON.stringify(updateForm);
                }
            } else {
                updateForm =
                    userType === "photographer"
                        ? { ...formProps }
                        : {
                              ...formProps,
                              FundingPartner: formProps.Funding === "Yes"
                          };
                config.body = JSON.stringify(updateForm);
            }

            console.log(config);

            const res = await fetch(`${FAIRSHOTS_API}api/${userType}/${id}`, config);
            if (res.ok) {
                const userProfile = await res.json();
                dispatch({
                    type: "UPDATE_PROFILE",
                    payload: updateForm
                });
                dispatch(toggleLoading());
            } else throw res;
        } catch (e) {
            console.log(e);
            dispatch({
                type: "PROFILE_ERROR",
                payload: typeof e === "object" ? e.statusText : e.toString()
            });
            dispatch(toggleLoading());
        }
    };
}
