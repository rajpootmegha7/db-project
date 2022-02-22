echo "Building the dependancies for Liquor Licensor Application...."

if psql -U postgres postgres < projectsetup.sql; then
    echo "Database has been Created Sucessfully"
    if python3 Data/dbsetup.py; then
        echo "Datasets downloaded Successfully in Updated in Postgres"
        echo 'Pyhton Script Completed';
        echo 'Installing the NPM Packages for Server';
        cd Client/my-liquor; npm i; cd ..; cd ..;cd Server; npm i; npm start;
        
    else
        echo "Exit code of $?, execution of dbsetup.py failed!!"
    fi

else
    echo "Exit code of $?, execution of projectsetup.sql failed!!"
fi
echo "Bash Script Execution Over"

