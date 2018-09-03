module.exports = phone=> {
    if (!phone) throw new Error('Please enter phone');
    const regular = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return regular.test(String(phone));
};