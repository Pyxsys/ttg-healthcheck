import {toast, ToastOptions, Bounce} from 'react-toastify';

const toastifyOptions: ToastOptions<{}> = {
  position: 'bottom-right',
  autoClose: 3000,
  theme: 'colored',
  transition: Bounce,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  pauseOnFocusLoss: false,
  draggable: false,
  progress: undefined,
};

export const notificationService = {
  info: (message: string) => {
    toast.info(message, toastifyOptions);
  },
  success: (message: string) => {
    toast.success(message, toastifyOptions);
  },
  warning: (message: string) => {
    toast.warning(message, toastifyOptions);
  },
  error: (message: string) => {
    toast.error(message, toastifyOptions);
  },
};
