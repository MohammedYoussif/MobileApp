const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const isValidEmail = (email: string) => emailRegex.test(email);

const phoneRegex = /^\+?\d{7,15}$/; // Accepts + and 7 to 15 digits
export const isValidPhone = (phone: string) => phoneRegex.test(phone);