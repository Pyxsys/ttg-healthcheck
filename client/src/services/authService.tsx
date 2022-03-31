import axios from 'axios'

export default {
  isAuthenticated: async () => {
    return await axios
      .get('api/user/authenticate')
      .then((response) => {
        if (response.data) {
          return response.data
        }
      })
      .catch(() => {
        return {
          isAuthenticated: false,
          user: { _id: '', name: '', role: '', avatar: '' },
        }
      })
  },
}
