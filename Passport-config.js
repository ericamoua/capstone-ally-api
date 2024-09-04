const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./Database'); 

// export passport authentication into passport-config.js
module.exports = function(passport) {
  passport.use(new LocalStrategy(
    async function(username, password, done) {
      try {
        // Compare the username from the database
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [username]);
        const user = rows[0];
        if (!user) {
          return done(null, false, { message: 'No user with that email' });
        }

        // Match password from the database and user input
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            console.log('They matched');
          return done(null, user); // Include the user object which should have `is_admin`
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id); // Serialize the user's ID
  });

  passport.deserializeUser(async function(id, done) {
    try {
      // Fetch user by ID including role information
      const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
      const user = rows[0];
      done(null, user); // Deserialize the user object, which should include `is_admin`
    } catch (err) {
      done(err);
    }
  });
};
