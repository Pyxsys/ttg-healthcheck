import {notificationService} from '../../services/notification.service';

const handleIncorrectInputLogin = (
    emailValid: boolean,
    passwordValid: boolean,
) => {
  // since the specific conditions are passed as parameters, you can use that information to display whatever it is that you like, depending on the situation.
  if (!emailValid) {
    notificationService.error(
        'Invalid Email!\n The email you have entered is either empty or too long!',
    );
  }
  if (!passwordValid) {
    notificationService.error(
        'Invalid Password!\n The password you have entered is either empty or too long!',
    );
  }
  return emailValid && passwordValid;
};

const handleIncorrectInputSignup = (
    nameValid: boolean,
    emailValid: boolean,
    passwordValid: boolean,
    passwordMatch: boolean,
) => {
  if (!nameValid) {
    // do whatever you want here
    notificationService.error(
        'Invalid Name! Name must not include symbols and the length must be less than 45 characters!',
    );
  }
  if (!emailValid) {
    // do whatever you want here
    notificationService.error('Invalid Email!');
  }
  if (!passwordValid) {
    // do whatever you want here
    notificationService.error(
        'Invalid Password! Name length must be less than 45 characters!',
    );
  }
  if (!passwordMatch) {
    // do whatever you want here
    notificationService.error('Passwords do not match!');
  }
  return nameValid && emailValid && passwordValid && passwordMatch;
};

export {handleIncorrectInputLogin, handleIncorrectInputSignup};
