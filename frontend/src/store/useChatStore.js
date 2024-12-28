import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import toast from 'react-hot-toast';

export const useChatStore = create((set) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,

    getUsers: async () => {
        set({isUserLoading: true});
        try {
            const response = await axiosInstance.get('/messages/users');
            set({users: response.data});
        } catch (error) {
            toast.error('Failed to fetch users');
        }
        set({isUserLoading: false});
    },
    
    getMessages: async (userId) => {
        set({isMessageLoading: true});
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({messages: response.data});
        } catch (error) {
            toast.error('Failed to fetch messages');
        }
        set({isMessageLoading: false});
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = useChatStore.getState();
        try {
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
          set({ messages: [...messages, res.data] });
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },
    setSelectedUser: (selectedUser) => set({selectedUser}),

}))

