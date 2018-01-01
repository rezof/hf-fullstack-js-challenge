## Prerequisites
- Node.js >= 6.8.0
- npm ^3.x
- yarn ^0.x
- mongodb ^3.x


## Usage

1. Clone this repository
    ```
    $ git clone https://github.com/rezof/hf-fullstack-js-challenge.git
    $ cd hf-fullstack-js-challenge
    ```
 
2. install packages
    ```
      $ [npm|yarn] install
    ```

3. build database
    ```
    $ [npm|yarn] run build:db
    ```

4. Rename config file and then edit the file. (`.env.example` to `.env`)
    ```
    PORT=4000
    MONGO_DB_URI='mongodb://localhost/shops'
    JWT_SECRET='topsecret'
    JWT_LIFESPAN=10368000
    ```

5. Start server
    ```
      $ [npm|yarn] start
    ```