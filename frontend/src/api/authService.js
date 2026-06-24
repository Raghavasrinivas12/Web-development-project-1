import apiClient from './apiClient';

export const authService = {
  // POST /user/signup
  signup: async (username, email, password, phone, role = 'customer') => {
    const response = await apiClient.post('/user/signup', {
      username,
      email,
      password,
      phone,
      role,
    });
    return response.data; // Structure: { msg, token, user }
  },

  // POST /user/signin
  signin: async (email, password) => {
    const response = await apiClient.post('/user/signin', { email, password });
    return response.data; // Structure: { msg, token, user }
  },

  // GET /user/profile
  getProfile: async () => {
    const response = await apiClient.get('/user/profile');
    return response.data; // Structure: { user }
  },

  // PUT /user/profile
  updateProfile: async (profileData) => {
    // profileData structure: { username, phone, profilePic }
    const response = await apiClient.put('/user/profile', profileData);
    return response.data; // Structure: { msg, user }
  },

  // DELETE /user/delete-account
  deleteAccount: async () => {
    const response = await apiClient.delete('/user/delete-account');
    return response.data; // Structure: { msg }
  },
};