Milestone 04 - Final Project Documentation
===

NetID
---
sl8794

Name
---
James Lee

Repository Link
---
https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-jameslee5363

URL for deployed site 
---
https://psychic-goldfish-5gqp4wqp96qwc4w97-3000.app.github.dev/

URL for form 1 (from previous milestone) 
---
http://localhost:3000/register

Special Instructions for Form 1
---

URL for form 2 (for current milestone)
---
http://localhost:3000/game


Special Instructions for Form 2
---
Blackjack game with hit/stand options and constant wager of $25. Only available after logging in.

URL for form 3 (from previous milestone) 
---
http://localhost:3000/login
http://localhost:3000/

Special Instructions for Form 3
---

First link to github line number(s) for constructor, HOF, etc.
---
https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-jameslee5363/blob/353bb7502b03179a9be15e074fedf220f09535c3/backend/app.mjs#L55-L68


Second link to github line number(s) for constructor, HOF, etc.
---
https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-jameslee5363/blob/353bb7502b03179a9be15e074fedf220f09535c3/backend/app.mjs#L32-L35

Short description for links above
---
app.use((req, res, next) => {...}) is a higher-order function (middleware) that adds the current user to res.locals for use in views

app.post('/register', async (req, res) => {...}) is a route handler that registers a new user and starts an authenticated session

Link to github line number(s) for schemas (db.js or models folder)
---
https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-jameslee5363/blob/353bb7502b03179a9be15e074fedf220f09535c3/backend/db.mjs#L1-L26

Description of research topics above with points
---
(TODO: add description of research topics here, including point values for each, one per line... for example: 2 points - applied and modified "Clean Blog" Bootstrap theme)
6 points - Implemented interactive blackjack game using react front-end framework
2 points - Implemented styling with Tailwind CSS for backend-generated routes (/, /register, /login)
3 points - Used Vite as a build tool to serve and build frontend blackjack React app

Links to github line number(s) for research topics described above (one link per line)
---
React: https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-jameslee5363/blob/353bb7502b03179a9be15e074fedf220f09535c3/frontend/vite-project/src/App.jsx#L1-L111

Tailwind: https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-jameslee5363/blob/353bb7502b03179a9be15e074fedf220f09535c3/backend/src/input.css#L1

https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-jameslee5363/blob/353bb7502b03179a9be15e074fedf220f09535c3/backend/public/output.css#L1

https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-jameslee5363/blob/353bb7502b03179a9be15e074fedf220f09535c3/backend/views/home.hbs#L6

Vite: https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-jameslee5363/blob/353bb7502b03179a9be15e074fedf220f09535c3/frontend/vite-project/vite.config.js#L1-L16

Optional project notes 
--- 
(TODO: optionall add add any other information required for using/testing the final project)

Attributions
---
(TODO:  list sources that you have based your code off of, 1 per line, with file name, a very short description, and an accompanying url... for example: routes/index.js - Authentication code based off of http://foo.bar/baz ... alternatively, if you have already placed annotations in your project, answer "See source code comments")

Entire react app in App.jsx based from https://react.dev/learn

Sanitize and Authentication in backend/app.mjs based off of homework05

