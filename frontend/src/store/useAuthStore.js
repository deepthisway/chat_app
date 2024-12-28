import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import {io} from 'socket.io-client';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isLoggingIn: false,
    isSigningUp: false,
    isLoggingOut: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            // console.log("Entered checkAuth function");

            const res = await axiosInstance.get("/auth/check");
            // console.log("Auth user is:" +res.data);
            set({ authUser: res.data }); 
            // console.log("CheckAuth passed");
            get().connectSocket();
            return true;
        } catch (error) {
            console.error("Error in check-auth:", error.message);

            set({ authUser: null });
            return false; // Return failure flag
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.msg);
        }
        finally{
            set({isSigningUp: false});
        }
    },
    logout: async() =>{
        try{
            set({isLoggingOut: true});
            await axiosInstance.post("/auth/signout");
            set({authUser: null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        }
        catch(error){
            toast.error(error.response.data.msg);
        }
    },
    login: async(data) =>   {
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post('/auth/signin', data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.message);
        }
        finally{
            set({ isLoggingIn: false });
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.error("Error in update profile:", error.response);
          toast.error(error.response?.data?.message || "An error occurred while updating the profile");
        } finally {
          set({ isUpdatingProfile: false });
        }
      },
    connectSocket: () => {
        const {authUser} = get();
        if(!authUser) return;

        const socket = io("http://localhost:5001",
        {
            query: {
                userId: authUser._id
            }
        }
        )
        socket.connect();
        set({socket: socket});

        socket.on("getOnlineUsers", (userIds) => {
            // if(!userIds || !)
            set({onlineUsers: userIds});
        })
    },
        disconnectSocket: () => {
            const {socket} = get();
            if(get().socket?.connected){
                get().socket.disconnect();
            }
        }
}));



/* checkAuth Method
This is an asynchronous function for checking if the user is authenticated:
Purpose:
To determine if a user is logged in and retrieve their details.
It sends a GET request to the /auth/check endpoint using axiosInstance.
Flow:
Sends a request to the server to check authentication status.
If successful, updates the authUser state with the user's data (res.data).
If an error occurs, logs the error and sets authUser to null (indicating no user is authenticated).
Finally, sets isCheckingAuth to false, signaling the process is complete. */
