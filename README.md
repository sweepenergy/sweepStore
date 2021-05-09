# Sweep Store
Sweep Store is a secure realtime database import desktop app. This app is used to streamline a users experience with importing their datasets
to Sweep Energy's cloud-based data gathering platform called Sweep API. Sweep Store features a secure one-time login, a drag and drop file upload, a visual representation of the uploaded dataset, a file structure that shows how data will be imported, and an editting tool to determine how data will be posted to Sweep API. 
## Dependencies
  Currently we are only using one external dependency which is a Redis server. To install redis, head over to their main page: https://redis.io/.
  Download version 6.2.3. If you are having issues downloading the aplication on windows, then you may also choose to download a microsoft port 
  using the following link: https://github.com/microsoftarchive/redis/releases/tag/win-3.0.504 (Note: this version is outdated)
## Installation
### via Package
  Currently this is not working correctly do to how we input our file paths through out the code.
### From Source
1. Clone the repository or download as a zip file
2. Install the dependencies using ***npm i***
3. Start up your Redis server. To do so navigate to your Redis directory, which you downloaded, and execute the "redis-server" file.
4.After the installation is completed, you can simply run the app  with ***npm start***. You can also test indivdual javascript files by moving to the correct directory and the use the command ***node <file>.js***.
