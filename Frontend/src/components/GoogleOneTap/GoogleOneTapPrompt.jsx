import React from "react";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, setUserId } from "../../store/userSlice";

export default function GoogleOneTapPrompt() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
      try {
        const googleToken = credentialResponse.credential;
        if (!googleToken) return;

        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.zealplane.com/api";
        const response = await axios.post(`${apiBaseUrl}/users/google-login`, {
          token: googleToken,
        });

        if (response.data?.user) {
          const { id, username, token: accessToken, refreshToken, profilePic, points } = response.data.user;
          localStorage.setItem("Id", id);
          localStorage.setItem("username", username);
          localStorage.setItem("token", accessToken);
          if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
          if (profilePic) localStorage.setItem("profilePic", profilePic);
          if (points) localStorage.setItem("points", points);

          dispatch(setUser(response.data.user));
          dispatch(setUserId(id));

          // Also mark poll verified so reader polls are unlocked
          if (response.data.user.email) {
            localStorage.setItem("zp_poll_verified_email", response.data.user.email);
          }
        }
      } catch (err) {
        console.warn("One Tap login error:", err);
      }
    },
    onError: () => {
      // User closed or dismissed the One Tap card
    },
    disabled: !!token, // Only show to unauthenticated visitors
    cancel_on_tap_outside: true,
  });

  return null;
}
