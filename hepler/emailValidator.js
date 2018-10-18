module.exports = email=> {
    if (!email) throw new Error('Please enter email');
    const regular = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const  isValid = regular.test(String(email).toLowerCase());
    if (!isValid) throw new Error ('Email is not Valid')
    return email;
};