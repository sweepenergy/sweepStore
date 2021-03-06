# Sweep Store
Sweep Store is a secure realtime database import desktop app. This app is used to streamline a user's experience with importing their datasets
to Sweep Energy's cloud-based data gathering platform called Sweep API. Sweep Store features a secure one-time login, a drag and drop file upload, a visual representation of the uploaded dataset, a file structure that shows how data will be imported, and an editing tool to determine how data will be posted to Sweep API. 

## Dependencies
  Currently we are only using one external dependency which is a Redis server. To install Redis, head over to their main page: https://redis.io/.
  Download version 6.2.3. If you are having issues downloading the application on windows, then you may also choose to download a Microsoft port 
  using the following link: https://github.com/microsoftarchive/redis/releases/tag/win-3.0.504 (Note: this version is outdated)
  
## Installation
### via Package:
  The project has been packaged using Github's their local npm registry. Currently, to properly run the server you will need to do the following:
  1. Start up your Redis server. To do so navigate to your Redis directory, which you downloaded, and execute the "redis-server" file.
  2. The project can be ran using the provided executible.
  
### From Source:
1. Clone the repository or download as a zip file
2. Install the dependencies using ***npm i***
3. Start up your Redis server. To do so navigate to your Redis directory, which you downloaded, and execute the "redis-server" file.
4. After the installation is completed, you can simply run the app  with ***npm start***. You can also test individual JavaScript files by moving to the correct directory and the use the command ***node <file>.js***.

## Details
### Secure One-time Login:
  The login functionality utilizes Express-session and a Redis server. When the app is initially loaded, the user is prompted to login via their API key and API 
  token. The API key and API token can be generated by creating a Facility Ops account. The login information would be authenticated through the http request to the
  Sweep API. If the login is unsuccessful (wrong API Key or Token), the login page would be reloaded.
  
  If the login is successful, the user information is sent to the Redis server to be stored into a session cookie. The user's session is then saved by Express-  session. The next time the user opens the app, we check for a session cookie and if it exists in the redis storage then the user is automatically logged in.
  
### DropzoneJS:
  DropzoneJS is a JavaScript library that allows us to implement a drag and drop file upload form. This was paired with multer to save the upload file to 
  the local file system, under "./src/public/datasets". The file is also given a name of "client_data.csv". By saving the file to the loval system, this 
  allows to automatically generate the visual viewer when we transition to that page. In addition, this allows us to parse the data in "testDataOrg.js" by 
  providing a link to the location of the dataset. 
  
### Visual Viewer:
  Here the visual viewer is used display the uploaded dataset onto the page. In addition, on this same page the user can decided on how they want to import their
  data. They select each column to either be a directory, stream, timestamp, or ts_param. However, there may only ever be one directory, one stream, 
  one timestamp, and as many ts_params as they want associated to a stream. If the user doesn't choose a stream, they will be prompted to enter a stream. 
  After the user has selected and confirmed their edits, a file structure tree is also displayed. An object describing the entries as (key,value) pairs is created 
  an passed to the Express server to be utilized by our parser.

  The limitation here is that file structure tree is not generated automatically. Ideally as the user selects column types, the tree will begin generating. 
  But currently the tree only generates after they select "confirm".
  
### Data parsing and Importation:
  The column types object is passed to the "getColumns()" function of "testDataOrg.js". This begins the parsing of data using Papa-parse as well importation. 
  First, we create our directory then our stream. Once that is completed we parse the data and compare the column value of a data cell to the (key,value) pair 
  of our column type object. If its a timestamp, we post to the correct stream. If it is a ts_param, then store it in an array of ts_params. Once all ts_params 
  are found we make a post request to the Sweep API including the ts_param array.
  
  The limitation that we have found so far is that the program struggles to import correctly when the csv file has more than 3000 rows.
  
## Future Implementation
### Secure One-time Login:
  - The entire project may be packaged within a docker container, containing our Redis server and the our source. This is so that the user will not need to
  individually boot the Redis server, then the program. With docker, they can both be started with a single command. 
  
### Visual Viewer:
  - When selecting a ts_param, we would like the user to be able to select the unit type of data. This may be integer values, names, float values, etc.
  - In addition, a progress bar would like to be added to indicate how far a long the import process is. When the progress bar completely filled, meaning
  the importation was successful, then the user will be rerouted to the success page.
  
### Data parsing: 
  - Ideally the project will be able to handle multiple differing file types such as: excel, Mysql, PostgresDB, etc.
