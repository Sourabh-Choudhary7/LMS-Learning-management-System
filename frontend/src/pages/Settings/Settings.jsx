import React, { useState } from 'react';
import Layout from '../../layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { deactivateUserAccount, deleteUserAccount, getUserData, logout, toggleTwoFactorAuth } from '../../redux/Slices/AuthSlice';
import { MdOutlineDarkMode, MdOutlineLightMode, MdLock, MdSecurity, MdHelp, MdExpandMore, MdExpandLess, MdManageAccounts } from 'react-icons/md';
import { FaSignInAlt } from 'react-icons/fa';
import { setMode } from '../../redux/Slices/modeSlice';
import { Link } from 'react-router-dom';
import { VscColorMode } from 'react-icons/vsc';
import { TiUserDelete } from 'react-icons/ti';

const Settings = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state?.auth?.data);
  const loginActivity = useSelector((state) => state?.auth?.loginActivity);
  const tfa = userData?.twoFactorAuth;
  const { darkMode } = useSelector((state) => state?.mode);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Accordion state
  const [openSection, setOpenSection] = useState(null);

  // Toggle dark/light mode
  const handleMode = () => {
    dispatch(setMode(!darkMode));
  };

  // Toggle 2FA
  const handleToggle2FA = async () => {
    setIsLoading(true);
    const res = await dispatch(toggleTwoFactorAuth());
    if (res?.payload?.success) await dispatch(getUserData());
    setIsLoading(false);
  };

  //account deletion
  const handleAccountDeletion = async () => {
    setIsLoading(true);
    let res = await dispatch(deleteUserAccount());
    if (res?.payload?.success) {
      await dispatch(logout());
      navigate('/login');
    }
    setIsLoading(false);
  };

  // Deactivating the user's account 
  const handleAccountDeactivate = async () => {
    setIsLoading(true);
    let res = await dispatch(deactivateUserAccount());
    if (res?.payload?.success) {
      await dispatch(logout());
      navigate('/login');
    }
    setIsLoading(false);
  };

  // Toggle accordion sections
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <Layout>
      <div className={`p-4 rounded-lg min-h-[80vh] ${darkMode ? 'text-white' : 'text-gray-900 bg-white'}`}>
        <h1 className="text-4xl mb-6 text-center text-yellow-500">Settings</h1>

        {/* Accordion Item: Dark/Light Mode */}
        <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'} py-4 px-4`}>
          <h2 className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSection('darkMode')}>
            <VscColorMode size={24} />
            <span>Dark/Light Mode</span>
            {openSection === 'darkMode' ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
          </h2>
          {openSection === 'darkMode' && (
            <div className="mt-4 ml-8">
              <section className="cursor-pointer" onClick={handleMode}>
                {darkMode ? (
                  <div className="flex items-center gap-4">
                    <MdOutlineDarkMode size="20px" /> <p>Disable Dark Mode</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <MdOutlineLightMode size="20px" /> <p>Enable Dark Mode</p>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>

        {/* Accordion Item: Password Management */}
        <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'} py-4 px-4`}>
          <h2 className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSection('password')}>
            <MdLock size={24} />
            <span>Password Management</span>
            {openSection === 'password' ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
          </h2>
          {openSection === 'password' && (
            <div className="mt-4 ml-8">
              <Link
                to="/changepassword"
                className="bg-blue-600 hover:bg-blue-500 transition-all ease-in-out duration-300 rounded-md font-semibold py-2 px-4 cursor-pointer text-white"
              >
                Change password
              </Link>
            </div>
          )}
        </div>

        {/* Accordion Item: Login Activity */}
        <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'} py-4 px-4`}>
          <h2 className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSection('loginActivity')}>
            <FaSignInAlt size={24} />
            <span>Login Activity</span>
            {openSection === 'loginActivity' ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
          </h2>
          {openSection === 'loginActivity' && (
            <div className="mt-4 ml-8">
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left font-semibold">IP Address</th>
                      <th className="py-2 px-4 border-b text-left font-semibold">Device</th>
                      <th className="py-2 px-4 border-b text-left font-semibold">Location</th>
                      <th className="py-2 px-4 border-b text-left font-semibold">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginActivity?.map((activity, index) => (
                      <tr key={activity.id || index} className={`${darkMode ? 'text-white' : 'text-black'}`}>
                        <td className="py-2 px-4 border-b">{activity?.ip}</td>
                        <td className="py-2 px-4 border-b">{activity?.device}</td>
                        <td className="py-2 px-4 border-b">
                          {activity?.location?.city}, {activity?.location?.country}
                        </td>
                        <td className="py-2 px-4 border-b">{new Date(activity.time).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Accordion Item: Account */}
        <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'} py-4 px-4`}>
          <h2 className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSection('account')}>
            <MdManageAccounts size={24} />
            <span>Account Setting</span>
            {openSection === 'account' ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
          </h2>
          {openSection === 'account' && (
            <>
              <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'} py-4 px-4`}>
                {/* Two-Factor Authentication */}
                <div>
                  <h2 className="flex items-center gap-2">
                    <MdSecurity size={24} />
                    <span>Two-factor Authentication (2FA)</span>
                  </h2>
                  <div className="ml-8 mt-2">

                    {!tfa ? (
                      <button
                        className={`btn btn-primary btn-outline btn-sm ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`}
                        disabled={isLoading}
                        onClick={handleToggle2FA}
                      >
                        {isLoading ? 'Please wait...' : 'Enable'}
                      </button>
                    ) :
                      (
                        <button
                          className={`btn btn-secondary btn-outline btn-sm ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`}
                          disabled={isLoading}
                          onClick={handleToggle2FA}
                        >
                          {isLoading ? 'Please wait...' : 'Disable'}
                        </button>
                      )

                    }

                  </div>
                </div>
                <div>
                  <h2 className="mt-4 flex items-center gap-2">
                    <TiUserDelete size={24} />
                    <span>Delete / Deactivate Account</span>
                  </h2>
                  <div className="ml-8 mt-2 flex gap-4">
                    <button
                      className="btn btn-error btn-outline btn-sm cursor-pointer"
                      onClick={() => setIsConfirmModalOpen(!isConfirmModalOpen)}
                    >
                      Delete Account
                    </button>

                    <button
                      className={`btn btn-secondary btn-outline btn-sm ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`}
                      disabled={isLoading}
                      onClick={handleAccountDeactivate}
                    >
                      {isLoading ? 'Deactivating Account...' : 'Deactivate Account'}
                    </button>

                  </div>
                </div>
              </div>
            </>
          )}
        </div>


        {/* Accordion Item: Help and Support */}
        <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'} py-4 px-4`}>
          <h2 className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSection('help')}>
            <MdHelp size={24} />
            <span>Help and Support</span>
            {openSection === 'help' ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
          </h2>
          {openSection === 'help' && (
            <div className="mt-2 ml-8">
              <>
                <li>Help Centre - FAQs</li>
                <li>Term and Privacy Policy</li>
                <li>Contact Support</li>
                <li>Report an issue</li>
              </>
            </div>
          )}
        </div>
        {/* Confirmation Modal */}
        {
          isConfirmModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="w-full max-w-md p-6 bg-gray-900 rounded-md shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Delete User</h3>
                  <button
                    className="text-xl font-bold text-red-500 hover:text-red-600 transition-all ease-in-out duration-30"
                    onClick={() => setIsConfirmModalOpen(!isConfirmModalOpen)}
                  >
                    &times;
                  </button>
                </div>
                <p className="mt-4 text-gray-300 ">
                  Are you sure you want to Permanent delete this account?
                </p>
                <div className="flex items-center mt-4 w-full gap-4">
                  <button
                    className={`w-1/2 btn btn-error btn-sm transition-all ease-in-out duration-30 ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`}
                    disabled={isLoading}
                    onClick={handleAccountDeletion}
                  >
                    {isLoading ? "Deleting Account" : "Delete Account"}
                  </button>
                  <button
                    className=" w-1/2 btn btn-accent btn-sm rounded-md transition-all ease-in-out duration-30"
                    onClick={() => setIsConfirmModalOpen(!isConfirmModalOpen)}
                  >
                    Cancel
                  </button>

                </div>
              </div>
            </div>
          )

        }

      </div>
    </Layout>
  );
};

export default Settings;
