interface User {
    name: string,
    email: string,
    lastName: string,
    username: string,
    password: string
}
export function isUserValid(user: User){
    const { name, email, lastName, username, password } = user;
    const passwordValid = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).test(password);
    const emailValid = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email);
    if(name.length > 3 && emailValid && username.length > 3 && lastName.length > 3 && passwordValid) return true;
    return false;
}