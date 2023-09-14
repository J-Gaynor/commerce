const express = require('express');
const pgp = require('pg-promise')();
require('dotenv').config();
const registration_validation = require('./registration_validation')
const bcrypt = require('bcrypt'); // Used to compare and hash passwords
const session = require('express-session'); // Used to store sessions
const passport = require('passport'); 
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash'); // Used to pass error messages in this case
const cors = require('cors');

const {
    PG_USERNAME,
    PG_PASSWORD,
    PG_PORT,
    PG_DATABASE
} = process.env; // Extract from .env file

const db = pgp(`postgres://${PG_USERNAME}:${PG_PASSWORD}@localhost:${PG_PORT}/${PG_DATABASE}`) // Establish db

const app = express();
const PORT = 8000;
const saltRounds = 10; // Salt for hashes
const store = session.MemoryStore(); // IN PRODUCTION, USE A MORE ROBUST METHOD

app.use(session({
    secret: '62Tv7aAnMb7W',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false, // IN DEVELOPMENT YOU USE HTTP NOT HTTPS!!!
        sameSite: 'none'
    },
    resave: false,
    saveUninitialized: false,
    store,
}));

app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cors());

passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // Add this line to pass the request object
    },
    async (req, username, password, done) => {
        try {
            const user = await db.any('SELECT * FROM users WHERE username = $1', [username]);
            if (user.length === 0) {
                req.flash('error', 'Incorrect username'); // Set the flash message
                return done(null, false);
            }

            const hashedPassword = user[0].hashed_password;
            bcrypt.compare(password, hashedPassword, (err, result) => {
                if (err) {
                    return done(err);
                }
                if (result) {
                    return done(null, user);
                } else {
                    req.flash('error', 'Incorrect password'); // Set the flash message
                    return done(null, false);
                }
            });
        } catch (error) {
            return done(error);
        }
    }
));


passport.serializeUser((user, done) => {
    done(null, user[0].id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.any('SELECT * FROM users WHERE id = $1', [id]);
        if (user.length === 0) {
            return done(new Error('User not found'));
        }

        done(null, user[0]);
    } catch (error) {
        done(error);
    }
});


app.get('/register', (req, res, next) => {

})

app.post('/register', async (req, res, next) => {
    const username = req.query.username;
    const password = req.query.password;
    const email = req.query.email;
    let hashed_password;
    if (!username || !password || !email) {
        res.status(500).send('Missing account details.');
        return;
    }
    
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            res.status(500).send('Unable to hash password at this time.')
        } else {
            hashed_password = hash;
            try {
                await registration_validation(db, username, password, email);
                await db.any('INSERT INTO users (username, hashed_password, email_address) VALUES ($1, $2, $3)', [username, hashed_password, email]);
                const user = await db.any('SELECT * FROM users WHERE username = $1', [username]);
                res.status(200).send(`Thanks for signing up, ${username}!`);
            } catch (error) {
                res.status(409).send(error.message);
            }
        }
    });
    
});

app.get('/login', (req, res, next) => {
    const error = req.flash('error')

    if (error.length > 0) {
        res.send(`${error[0]}\nPlease log in.`);
        return; // Prevent the other res.send from firing.
    }
    res.send('Please log in.');
})

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/'
}));

app.get('/', (req, res, next) => {
    // Display all listings
    db.any('SELECT * FROM listings')
        .then(listings => { // Handle fetched data
            console.log('Listings data:', listings); // Add this line for debugging
            res.status(200).json(listings);
        })
        .catch(error => { // Handle error
            console.error('Database error:', error); // Add this line for debugging
            res.status(500).json({error: 'Internal server error'});
        });
});


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/cart', async(req, res, next) => {
    if (req.isAuthenticated()) {
        const user_id = req.user.id;
        const cartItems = await db.any(`
                SELECT item_name, price 
                FROM listings
                WHERE id IN (
                    SELECT item_id
                    FROM cart
                    WHERE user_id = $1
                )
                GROUP BY listings.item_name, price`
        , [user_id]);

        const total = cartItems.reduce((acc, item) => acc + parseFloat(item.price), 0).toFixed(2); // Starting from 0 (acc), add item price for each item in cartItems

        res.status(200).json({cartItems, total})
    } else {
        res.status(302).send('Not logged in')
    }
});

app.post('/cart', (req, res, next) => {
    if (req.isAuthenticated()){
        const user_id = req.user.id;
        res.status(302).redirect(`/cart/${user_id}/checkout`);
    } else {
        res.status(302).redirect('/login');
    };
});

app.get('/cart/:user_id/checkout', async(req, res, next) => {
    const checkout_id = req.params.user_id
    if(req.isAuthenticated() && checkout_id == req.user.id) {
        const address = req.user.address;
        if (address) {
            res.send(`Delivery Address: ${address}`)
        } else {
            res.status(409).send('Please update your account to add a delivery address.');
        };
    } else {
        res.status(302).redirect('/login');
    };
});

app.post('/cart/:user_id/checkout', async (req, res, next) => {
    const checkout_id = req.params.user_id;
    if (req.isAuthenticated() && checkout_id == req.user.id) {
        const user_id = req.user.id;
        const address = req.user.address;
        if (address) {
            try {
                await db.none('UPDATE cart SET bought = $1 WHERE user_id = $2', [true, user_id]);

                const orderedItems = await db.any('SELECT * FROM cart WHERE user_id = $1 AND bought = $2', [user_id, true]);
                const itemIds = orderedItems.map(item => item.item_id);
                const itemNamesData = await db.any('SELECT item_name FROM listings WHERE id IN ($1:csv)', [itemIds]);
                const itemNames = itemNamesData.map(item => item.item_name);
                const totalPrice = orderedItems.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);

                await db.none('INSERT INTO orders (user_id, items_ordered, total_price, user_address) VALUES ($1, $2, $3, $4)', [user_id, itemNames, totalPrice, address]);

                res.status(200).send('Order confirmed!');
            } catch (error) {
                console.error(error);
                res.status(500).send('An error occurred while processing the order.');
            }
        } else {
            res.status(409).send('Please update your account to add a delivery address.');
        }
    } else {
        res.status(302).redirect('/login');
    }
});

app.get('/orders/:user_id', async(req, res, next) => {
    const userOrderId = req.params.user_id;
    if(req.isAuthenticated()){
        const user_id = req.user.id;
        if (user_id == userOrderId) {
            const orders = await db.any('SELECT * FROM orders WHERE user_id = $1', [user_id]);
            res.status(200).send(orders);
        } else {
            res.status(302).redirect('/login');
        }
    } else {
        res.status(302).redirect('/login');
    }

})

app.get('/users/:username', async(req, res, next) => {
    //Display specified user
    const username = req.params.username;
    const checkForUser = await db.any('SELECT * FROM users WHERE username = $1', [username])
    
    if (checkForUser.length !== 1) {
        res.status(404).send('Bad request: User does not exist.');
        return;
    }
    const profile = await db.any('SELECT username, rating FROM users WHERE username = $1', [username]);
    const listings = await db.any('SELECT item_name, description, image, price FROM listings WHERE seller_id = (SELECT id FROM users WHERE username = $1)', [username])
    res.status(200).send({profile, listings});
})

app.put('/users/:username', async(req, res, next) => {
    const username = req.params.username;
    if (req.isAuthenticated() && username == req.user.username) {
        const user_id = req.user.id;
        const new_address = req.body.address;
        const updatedDetails = await db.any('UPDATE users SET address = $1 WHERE id = $2', [new_address, user_id])
        res.status(200).send(updatedDetails)
    } else {
        res.status(302).redirect('/login');
    }
})

app.get('/listing/:id', async(req, res, next) => {
    const id = req.params.id
    const checkForListing = await db.any('SELECT * FROM listings WHERE id = $1', [id]);
    if (checkForListing.length !== 1) {
        res.status(404).send('Bad request: this item does not exist.');
        return;
    }

    const listing = await db.any(`SELECT listings.item_name, listings.description, listings.image, listings.category_name, listings.price, users.username
    FROM listings JOIN users ON listings.seller_id = users.id WHERE listings.id = $1`, [id]);
    res.send(listing);
})

app.post('/listing/:id', async(req, res, next) => {
    if (req.isAuthenticated()) {
        const item_id = req.params.id;
        const user_id = req.user.id;
        const checkExistingCartItem = await db.oneOrNone('SELECT * FROM cart WHERE user_id = $1 AND item_id = $2', [user_id, item_id]); // db.oneOrNone instead of us checking length
        
        if (checkExistingCartItem) {
            await db.any('UPDATE cart SET quantity = quantity + 1 WHERE user_id = $1 AND item_id = $2', [user_id, item_id]);
        } else {
            await db.any('INSERT INTO cart (user_id, item_id, quantity) VALUES ($1, $2, $3)', [user_id, item_id, 1])
        }
        res.status(200).send('Added to cart!')
    } else {
        res.status(409).send('Are you logged in?')
    }
    
})

app.get('/:category', (req, res, next) => {
    //Display all listings of a category
    const category = req.params.category; //Assign the param to a variable
    db.any('SELECT * FROM listings WHERE category_name = $1', [category]) //Pass the variable into an SQL query
        .then(listings => {
            res.status(200).json(listings)
        })
        .catch(error => {
            res.status(500).json({error: 'Internal server error'})
        });
});

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})