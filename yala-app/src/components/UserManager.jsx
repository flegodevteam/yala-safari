import React, { useState } from 'react';
import { FiUsers,  } from 'react-icons/fi';


const UserManager = () => {

    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    // const [userToDelete, setUserToDelete] = useState(null);
  

  
    // const handleEdit = (user) => {
    //   setCurrentUser(user);
    //   setIsModalOpen(true);
    // };
  
    // const handleDelete = (id) => {
    //   setUserToDelete(id);
    //   setIsDeleteConfirmOpen(true);
    // };
  
    const confirmDelete = () => {
      // setUsers(users.filter(user => user.id !== userToDelete));
      setIsDeleteConfirmOpen(false);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // const formData = new FormData(e.target);
      // const updatedUser = {
      //   id: currentUser?.id || Date.now(),
      //   name: formData.get('name'),
      //   email: formData.get('email'),
      //   role: formData.get('role'),
      //   lastLogin: currentUser?.lastLogin || 'Never'
      // };
      
      if (currentUser) {
        // setUsers(users.map(user => user.id === currentUser.id ? updatedUser : user));
      } else {
        // setUsers([...users, updatedUser]);
      }
      
      setIsModalOpen(false);
      setCurrentUser(null);
    };
  
    return (
      <div className="">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-3xl lg:text-4xl font-bold text-[#034123] mb-2">User Management</h3>
            <p className="text-[#6b7280] text-base">Manage admin users and permissions</p>
          </div>
          <button 
            onClick={() => { setCurrentUser(null); setIsModalOpen(true); }}
            className="bg-[#f26b21] hover:bg-[#e05a1a] text-white px-5 py-3 rounded-xl hover:shadow-xl transition-all duration-300 shadow-lg flex items-center gap-2 font-semibold whitespace-nowrap"
          >
            <FiUsers className="w-5 h-5" /> Add New User
          </button>
        </div>
        
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="min-w-full divide-y divide-[#e5e7eb]">
              <thead className="bg-[#034123]/5">
                <tr>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-[#034123] uppercase tracking-wider">Name</th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-[#034123] uppercase tracking-wider">Email</th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-[#034123] uppercase tracking-wider">Role</th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-[#034123] uppercase tracking-wider hidden lg:table-cell">Last Login</th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-[#034123] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-[#e5e7eb]">
                {/* {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#f9fafb]/50 transition-colors duration-200">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#034123]">{user.name}</td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-[#4b5563]">{user.email}</td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className="inline-block px-3 py-1 bg-[#034123]/10 text-[#034123] rounded-lg text-xs font-bold border border-[#034123]/20 capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-[#6b7280] hidden lg:table-cell">{user.lastLogin}</td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleEdit(user)}
                          className="text-[#034123] hover:text-[#026042] font-semibold transition-colors duration-300"
                        >
                          Edit
                        </button>
                        {user.role !== 'admin' && (
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-300"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Add/Edit User Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setIsModalOpen(false)}>
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="p-6 lg:p-8">
                <h3 className="text-2xl font-bold text-[#034123] mb-6">
                  {currentUser ? 'Edit User' : 'Add New User'}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-[#034123] mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={currentUser?.name || ''}
                      className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                      required
                      placeholder="Full name"
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-[#034123] mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={currentUser?.email || ''}
                      className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                      required
                      placeholder="Email address"
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-[#034123] mb-2">Role</label>
                    <select
                      name="role"
                      defaultValue={currentUser?.role || 'editor'}
                      className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                    >
                      {/* {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))} */}
                    </select>
                  </div>
                  {!currentUser && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-[#034123] mb-2">Password</label>
                      <input
                        type="password"
                        name="password"
                        className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                        required
                        placeholder="Password"
                      />
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-3 border border-[#d1d5db]/60 rounded-xl text-sm font-semibold text-[#4b5563] hover:bg-[#f9fafb] transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-[#034123] hover:bg-[#026042] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#034123]/50 transition-all duration-300 hover:shadow-xl"
                    >
                      {currentUser ? 'Update' : 'Create'} User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setIsDeleteConfirmOpen(false)}>
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="p-6 lg:p-8">
                <h3 className="text-2xl font-bold text-[#034123] mb-4">Confirm User Deletion</h3>
                <p className="text-sm text-[#6b7280] mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="px-5 py-3 border border-[#d1d5db]/60 rounded-xl text-sm font-semibold text-[#4b5563] hover:bg-[#f9fafb] transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-5 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 hover:shadow-xl"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

export default UserManager;