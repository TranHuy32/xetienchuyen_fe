import axios from 'axios';
import { createRefresh } from 'react-auth-kit';
const beURL = process.env.REACT_APP_BE_URL;
const refreshApi = createRefresh({
    interval: 30,
    refreshApiCallback: async ({
        authToken,
        authTokenExpireAt,
        refreshToken,
        refreshTokenExpiresAt,
        authUserState,
    }) => {
        try {
            const response = await axios.post(
                `${beURL}/users-auth/refresh`,
                { 'refreshToken': refreshToken },
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                },
            );
            return {
                isSuccess: true,
                newAuthToken: response.data.accessToken,
                newRefreshToken: response.data.refreshToken,
                newAuthTokenExpireIn: 30,
                newRefreshTokenExpiresIn: 43200,
            };
        } catch (error) {
            console.error(error);
            return {
                isSuccess: false,
            };
        }
    },
});

export default refreshApi;
