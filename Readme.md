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

