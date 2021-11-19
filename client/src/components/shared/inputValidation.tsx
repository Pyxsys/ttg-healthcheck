import {notificationService} from '../../services/notification.service';

const handleIncorrectInput = (
    email: string,
    password: string,
    name?: string,
    password2?: string,
) => {
  const regex = /^[A-Za-z0-9 -]+$/;
  let nameValid = false;
  let passwordValid = false;
  let emailValid = false;
  let passwordMatch = false;
  const login = name == 'login';
  // check if name does not include symbols and that length is less than 45
  if (name) {
    nameValid = regex.test(name) && name.length < 45 && name.length > 0;
  } else if (login) {
    nameValid = true;
  }
  // check that email is not empty and less than 80 characters
  if (email) {
    emailValid = email.length < 80 && email.length > 0;
  }
  // check if password is less than 45 characters
  if (password) {
    passwordValid = password.length < 45 && password.length > 0;
  }
  // check if password 2 matches password
  if (password2) {
    passwordMatch = password === password2 && password2.length > 0;
  } else if (login) {
    passwordMatch = true;
  }
  // check if all is valid
  const allValid = passwordMatch && passwordValid && nameValid && emailValid;
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
  if (!nameValid) {
    // do whatever you want here
    notificationService.error(
        'Invalid Name! Name must not include symbols and the length must be less than 45 characters!',
    );
  }
  if (!passwordMatch) {
    // do whatever you want here
    notificationService.error('Passwords do not match!');
  }
  return allValid;
};
export default handleIncorrectInput;
