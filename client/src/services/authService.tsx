import axios from 'axios';

export default {
  isAuthenticated: async () => {
    return await axios
        .get('api/user/authenticate')
        .then((response) => {
          if (response.data) {
            return response.data;
          }
        })
        .catch((error) => {
          return {isAuthenticated: false, user: {name: '', role: ''}};
        });
  },
};
