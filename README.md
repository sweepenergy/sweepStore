# Sweep Store
Sweep Store is a secure realtime database import desktop app. This app is used to streamline a users experience with importing their datasets
to Sweep Energy's cloud-based data gathering platform called Sweep API. Sweep Store features a secure one-time login, a drag and drop file upload, a visual representation of the uploaded dataset, a file structure that shows how data will be imported, and an editting tool to determine how data will be posted to Sweep API. 
## Dependencies
  Currently we are only using one external dependency which is a Redis server. To install redis, head over to their main page: https://redis.io/.
  Download version 6.2.3. If you are having issues downloading the aplication on windows, then you may also choose to download a microsoft port 
  using the following link: https://github.com/microsoftarchive/redis/releases/tag/win-3.0.504 (Note: this version is outdated)
## Installation
### via Package:

   We tried packaging the project using electron forge, but currently this is not working correctly do to how we input our file paths through out the code.
   The following is an example from the server.js 
   file of where the links fail.
   
   
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
      cb(null, './src/public/datasets')
    },
  
### From Source:
1. Clone the repository or download as a zip file
2. Install the dependencies using ***npm i***
3. Start up your Redis server. To do so navigate to your Redis directory, which you downloaded, and execute the "redis-server" file.
4.After the installation is completed, you can simply run the app  with ***npm start***. You can also test indivdual javascript files by moving to the correct directory and the use the command ***node <file>.js***.
## Details
### Secure One-time Login:
  The login functionality utilizes Express-session and a Redis server. When the app is initially loaded, the user is prompted to login via their API key and API token.
  ***CONTINUE...***
### DropzoneJS:
  DropzoneJS is a javascript library that allows us to implement a drag and drop file upload form. This was paired with multer to save the upload file to 
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
  But, currently the tree only generate after they select "confirm".
### Data parsing and Importation:
  The column types object is passed to the "getColumns()" function of "testDataOrg.js". This begins the parsing of data using Papa-parse as well importation. 
  First, we create our directory then our stream. Once that is completed we parse the data and compare the column value of a data cell to the (key,value) pair 
  of our column type object. If its a timestamp, we post to the correct stream. If it is a ts_param, then store it in an array of ts_params. Once all ts_params 
  are found we make a post request to the Sweep API including the ts_param array.
  
  The limitation that we have found so far is that the program struggles to import correctly when the csv file has more then 3000 rows.
  
