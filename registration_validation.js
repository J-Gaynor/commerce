const registration_validation = async (db, username, password, email) => {
    console.log(username, password, email)
    
    const usernameExists = await db.any('SELECT * FROM users WHERE username = $1', [username]);
    const emailExists = await db.any('SELECT * FROM users WHERE email_address = $1', [email]);
    if (usernameExists.length !== 0) {
        throw new Error('Username already taken.');
    } else if (password.length < 7) {
        throw new Error('Password must be 7 characters or more.');
    } else if (emailExists.length !== 0) {
        throw new Error('Email already taken');
    } else {
        return true;
    }
}

module.exports = registration_validation;