# Chai aur Backend Series 
This is a video series on backend with javascript<br>
- [Model link] <!--Paste the link here in curly brackets-->
## Video 6 How to do a professional backend setup
.gitkeep is used to keep and commit a empty folder on github <br>
.gitignore is used to avoid sensitive info to go on the github (usually make one with gitignore genrator online) <br>
.env fileis used to environment variables <br>


We have to install nodemon as a dev dependency instead of a main dependency (dev = devloper phase)<br>

gitignore is not updated yet and also nodemodules is not made as we have not installed nodemon as a devDependencies<br>

We download a devDependencies like npm i -D prettier <br> 
This prettier is used to avoid small conflicts in a team like some add semicolon and some not and tabs spaces ...<br>

Always Remember that index.js file is being executed on doing npm run dev and don't forget to add nodemon index.js into the script as dev <br>

Installing all of the packages such as mongoose express dotenv <br>

Always wrap database connection into try catch or promise <br>
Database is always is another continent so always apply async await for db connection <br>

Always start IIFE with a semicolon to start a new fresh function not something related to previous line <br>

we have to change the package.json dev part when importing dotenv using the import method <br>

Sometimes we have to import using extension and we can export uisng const or default <br>

## Api Response and Error Handling 
first of all we learned about a new method to export see app.js {} <br>
A database connection req is a async process so it returns a promise so we wrote .then and .catch for that purpose <br>

Sometimes there are issues between database and express to find that we put a app.on after the connection in a .then before the app.listen <br>

app.use for middlewares or for any type of configuration changes <br>
Remember to add the variable CORS_ORIGIN in .env file and add an orgin that except request from this origin only <br>

Made express ready to take json file app.use(express.json()) and then made it ready for taking data from url <br>

cookie-parese used for excessing cookies from user and also set cookies and all of the app.use is done <br>

Now we are working on asyncHnadler in the utils file <br>

We made our own ApiError file in utils for customized error messages <br>

Next we are making api response file making our own class and learn more about constructor <br>

Made a model of user and video ƒrom model link and then went ahead with mongoose aggregation pipeline   <br>

We are installing bcrypt for password protection and hashing and next is json web token  <br>

Arrow Function does'nt have access to this of a object and then encrypting the user data using bcrypt and then used bcrypt to add a function to check whether the password is correct or not  <br>

Made refresh token and acess token generator in userSchema methods remember it's methods not method <br>

Downloaded cloudinary and multer to file image storing and handling and made cloudinary.js in utils <br>

Handling multer in multer.middleware.js storing the file temporarily <br>

Till now we have only done production grade setup and we have not made any sort of backend remember how we did this <br>

Making Controller now and made routes in user.routes and passed control from app.js <br>

we can give our own name when there is export default otherwise give same name in curly brackets <br>
Making register user <br>

We learnt how to use postman and user.controllers register user is completed <br>

Made Login user after the register user and also made a route for that <br>