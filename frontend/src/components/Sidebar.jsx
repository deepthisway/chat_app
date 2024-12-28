import React, { useEffect } from 'react'
import SidebarSkeleton from './skeletons/SidebarSkeleton';

const Sidebar = () => {
    const {getUsers, users, selectedUser, setSelectedUser, isUserLoading} = useChatStore();

    useEffect(()=>  {
        getUsers();
    }, [getUsers]);

    if(isUserLoading) return <SidebarSkeleton/>

  return (
    <div>Sidebar</div>
  )
}

export default Sidebar