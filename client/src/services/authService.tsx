import axios from 'axios';

export default {
  isAuthenticated: async () => {
    return await axios.get('api/user/authenticate').then((response) => {
      if (response.data) {
        return response.data;
      } else {
        return {isAunthenticated: false, user: {name: '', role: 'none'}};
      }
    });
  },
};
