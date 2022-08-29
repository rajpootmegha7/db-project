

# Your Project

Liquor store application is designed to give customers information about data related to liquor, owner, wholesaler and premise address etc. Active license infomation will help customer open their own business using this data in a specific county, city, method of operation, licesce codes and others. Our project encompass two datasets : 

    (A)"Liquor_Authority_Current_List_of_Active_Licenses_Data" - Primary Dataset, implemnted in postgres. 
    This dataset includes the active licenses in NYS and is updated daily. More detailed information regarding newly issued licenses can be obtained from through our Public Query section of the SLA website, www.sla.ny.gov or through the Freedom of Information Law (FOIL) process.

    (B)"State_Liquor_Authority_Data" - Secondary Dataset, implemnted in mongo atlas.
    Brand Label and Wholesale Information for Alcohol Products Registered in NYS.The New York State Alcohol Beverage Control Law specifies that no manufacturer or wholesaler shall sell to any retailer nor shall any retailer purchase any alcoholic beverages unless these beverages are labeled in accordance with the Authority's Rules and Federal Regulations and unless such label shall be registered with and approved by the State Liquor Authority. Effective January 1, 1994, wine does not need to be brand label registered if the wine has received label approval from the Bureau of Alcohol, Tobacco and Firearms (BATF).

## Data

Data can be retrived using these URLs for both the datasets. We are using this dbsetup.py in the shell script to load the data and perform other operations on it.
Primary Dataset 1 : https://data.ny.gov/Economic-Development/Liquor-Authority-Current-List-of-Active-Licenses/hrvs-fxs2
Primary Dataset JSON : https://data.ny.gov/resource/hrvs-fxs2.json?$limit=50000

Secondary Dataset 2 : https://data.ny.gov/Economic-Development/State-Liquor-Authority-SLA-Brand-Label-and-Wholesa/n2dz-pwuk
Secondary Dataset JSON : https://data.ny.gov/resource/n2dz-pwuk.json?$limit=50000


All the csv are being downloaded to the `Data` directory.

## Build

List the steps needed to build your application from the terminal. That should include the step needed to install dependencies (including your non-relational datastore).You should also include the step needed to set up the database and configure your schema. Assume a clean Postgres install.

STEPS TO BUILD THE APPLICATION:

1. Install node into the system.
    It is a primary requirement as the application is built using node modules. It can be downloaded from https://docs.npmjs.com/downloading-and-installing-node-js-and-npm Or to update use [npm install -g npm] command. To check the version npm -v.
2. Git pull from https://github.com/rajpootmegha7/db-project.git or use the DB_Project.compress to save in your local system other than in any restictive space.
3. Make sure to add the all the pyhton dependencies from the requirements.txt (<YOUR PATH>/DB_Project/requirements.txt ).
4. Open the folder space DB_Project in terminal or cd <YOUR PATH>/DB_Project in terminal.
5. Execute bash script using command 'bash execute.sh'
6. If you see the text SUCCESSFULLY COMIPLED AND BUIT, the app will open automatically in the localhost:3000 port.


## Run

In order to fetch the data from api's and load it into postgresql and mongo database and run the applicaiton :
In terminal:

cd <YOUR PATH>/DB_Project
Run application: `bash execute.sh`
