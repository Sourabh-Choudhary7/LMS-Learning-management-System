import React, { useState } from 'react'
import Layout from '../../layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { getUserData, toggleTwoFactorAuth } from '../../redux/Slices/AuthSlice'

const Settings = () => {
  const userData = useSelector((state) => state?.auth?.data)
  const tfa = userData?.twoFactorAuth;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);



  const handleToggle2FA = async () => {
    setIsLoading(true);
    const payload = {
      userId: userData?._id,
    }
    const res = await dispatch(toggleTwoFactorAuth(payload))
    if (res?.payload?.success)
      await dispatch(getUserData())
    setIsLoading(false);
  }

  return (
    <Layout>
      <div className='min-h-[80vh] text-white'>
        <h1 className='text-4xl'>We can add on Settings page</h1>
        <br />
        <ol>
          <li>1. Two-factor Authentication (2FA)</li>
          <div className="flex my-4 mx-4">
            <button className={`btn btn-primary btn-outline btn-sm ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`} disabled={isLoading} onClick={handleToggle2FA}>{tfa ? 'Disable' : 'Enable'}</button>
          </div>
          <li>2. Language Preferences: Change the language used in the app.</li>
          <li>3. Delete/Deactivate Account</li>
          <li>4. Dark/Light Mode Toggle</li>
          <li>5. Password Management: Change or update passwords.</li>
          <li>6. Login Activity: View recent login locations and devices.</li>
          <li>7. Help and Support: FAQs or Knowledge Base, Contact support, Report an issue</li>
        </ol>

      </div>

    </Layout>
  )
}

export default Settings