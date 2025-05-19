import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import { User, Game } from './db.mjs';
import hbs from 'hbs';
import mongoose from 'mongoose';
import sanitize from 'mongo-sanitize';
import './db.mjs';
import './config.mjs'
import session from 'express-session';
import * as auth from './auth.mjs';
import cors from 'cors';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/game', express.static(path.join(__dirname, '../frontend/vite-project/dist')));

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));
  
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

app.get('/', (req, res) => {
    const user = req.session.user;
    res.render('home', {
      title: user ? `${user.username}'s Home` : 'Welcome',
      loggedIn: !!user,
      user: user ? `${user.username}` : '',
      balance: user ? user.balance : 0
    });
});

app.listen(process.env.PORT ?? 3000);

const registrationMessages = {"USERNAME ALREADY EXISTS": "Username already exists", "USERNAME PASSWORD TOO SHORT": "Username or password is too short"};

app.get('/register', (req, res) => {
    res.render('register');
});
  
app.post('/register', async (req, res) => {
    try {
        const newUser = await auth.register(
        sanitize(req.body.username), 
        sanitize(req.body.email), 
        req.body.password
        );
        await auth.startAuthenticatedSession(req, newUser);
        res.redirect('/'); 
    } catch(err) {
        console.log(err);
        res.render('register', {message: registrationMessages[err.message] ?? 'Registration error'}); 
    }
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

const loginMessages = {"PASSWORDS DO NOT MATCH": 'Incorrect password', "USER NOT FOUND": 'User doesn\'t exist'};

app.post('/login', async (req, res) => {
    try {
        const user = await auth.login(
            sanitize(req.body.username), 
            req.body.password
        );
        await auth.startAuthenticatedSession(req, user);
        res.redirect('/'); 
    } catch(err) {
        console.log(err)
        res.render('login', {message: loginMessages[err.message] ?? 'Login unsuccessful'}); 
    }
});


// app.get('/game', (req, res) => {
//     res.redirect('http://localhost:5173');
// });

app.post('/deposit', async (req, res) => {
    if (!req.session.user) return res.sendStatus(401);
  
    const amount = parseInt(req.body.amount, 10);
  
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).send('Invalid deposit amount.');
    }
  
    // Update both session and database
    req.session.user.balance += amount;
    await User.updateOne(
      { _id: req.session.user._id },
      { $inc: { balance: amount } }
    );
  
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.log(err);
        return res.redirect('/');  
      }
      res.clearCookie('connect.sid');  
      res.redirect('/login');          // Send user to login page after logout
    });
});

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/vite-project/dist', 'index.html'));
});

////////Blackjack

function randomCard() {                    // infinite shoe
    const suits = ['H','D','C','S'];          // ♥ ♦ ♣ ♠
    const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    const r = ranks[Math.floor(Math.random() * ranks.length)];
    const s = suits[Math.floor(Math.random() * suits.length)];
    return `${r}${s}`;
}
  
const cardVal = r =>
r === 'A' ? 11 : ['K','Q','J'].includes(r) ? 10 : Number(r);

function handValue(hand) {
    let total = 0, aces = 0;
    hand.forEach(c => {
        const rank = c.slice(0, -1);
        total += cardVal(rank);
        if (rank === 'A') aces++;
    });
    while (total > 21 && aces) { total -= 10; aces--; }
    return total;
}

function newGameSession(sess) {
    sess.game = {
        player: [randomCard(), randomCard()],
        dealer: [randomCard(), randomCard()],
        status: 'PLAYER_TURN',
        message: 'Hit or Stand?'
    };
}

function scoreState(game) {
    const pVal = handValue(game.player);
    const dVal = handValue(game.dealer);
    return { ...game, pVal, dVal };
}

app.get('/api/v1/game', (req, res) => {
    if (!req.session.user) return res.sendStatus(401);
  
    if (req.session.user.balance <= 0) {
      return res.status(403).json({ error: "Insufficient balance. Please deposit to play." });
    }
  
    if (!req.session.game || req.session.game.status === 'FINISHED')
      newGameSession(req.session);
  
    res.json(scoreState(req.session.game));
});

app.post('/api/v1/hit', async (req, res) => {
    const g = req.session.game;
    if (!g || g.status !== 'PLAYER_TURN') return res.sendStatus(400);
  
    g.player.push(randomCard());
    const pVal = handValue(g.player);
  
    if (pVal > 21) {
        while (handValue(g.dealer) < 17) g.dealer.push(randomCard());
      
        g.status  = 'FINISHED';
        g.message = 'You bust! Dealer wins.';
      
        req.session.user.balance -= 25;
        await User.updateOne(
          { _id: req.session.user._id },
          { $inc: { balance: -25 } }
        );

        const newGame = new Game({
            username: req.session.user.username,
            result: 'lose'
        });

        await newGame.save();
    }
    res.json({ ...g, pVal, dVal: handValue(g.dealer) });
});
  
app.post('/api/v1/stand', async (req, res) => {
    const g = req.session.game;
    if (!g || g.status !== 'PLAYER_TURN') return res.sendStatus(400);
  
    while (handValue(g.dealer) < 17) g.dealer.push(randomCard());
  
    const p = handValue(g.player), d = handValue(g.dealer);
  
    if (d > 21 || p > d) {
        g.message = 'You win!';
        req.session.user.balance += 25;
        await User.updateOne(
          { _id: req.session.user._id },
          { $inc: { balance: 25 } }
        );

        const newGame = new Game({
            username: req.session.user.username,
            result: 'win'
        });
    
        await newGame.save();
    } else if (p === d) {
        g.message = 'Push.'; // no balance change

        const newGame = new Game({
            username: req.session.user.username,
            result: 'push'
        });
    
        await newGame.save();
    } else {
        g.message = 'Dealer wins.';
        req.session.user.balance -= 25;
        await User.updateOne(
          { _id: req.session.user._id },
          { $inc: { balance: -25 } }
        );

        const newGame = new Game({
            username: req.session.user.username,
            result: 'lose'
        });
    
        await newGame.save();
    }
  
    g.status = 'FINISHED';
    res.json({ ...g, pVal: p, dVal: d });
});

app.get('/api/v1/me', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not logged in' });
    }
    res.json({
        username: req.session.user.username,
        balance: req.session.user.balance
    });
});