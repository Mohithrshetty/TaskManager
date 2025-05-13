import React from 'react'
import { useUserAuth } from '../../Hooks/useUserAuth'

const UserDashboard = () => {
  useUserAuth()
  return (
    <div>
      UserDashboard
    </div>
  )
}

export default UserDashboard
