# Auth App using MERN stacks

Basic MERN authentication app for signup and login.

## Instructions to run locally


-  **Install Dependencies**

    ```bash
    $ git clone https://github.com/RaiVaibhav/mern-auth-app.git
    $ cd ~/mern-auth-app
    $ npm install && cd client && npm install && cd ..
    ```
- **Run server** (first run the mongodb locally or set the mongoURI from mongolab in `config/key.js` file)

    ```bash
    $ cd ~/mern-auth-app
    $ npm run dev
    # http://0.0.0.0:3000/
    ```