# -*- coding: utf-8 -*-

import requests
import psycopg2
import psycopg2.extras
import pandas as pd


response_LA = requests.get("https://data.ny.gov/resource/hrvs-fxs2.json?$limit=50000")
response_State = requests.get("https://data.ny.gov/resource/n2dz-pwuk.json?$limit=50000")
LA_data = response_LA.content
State_data = response_State.content

# print(State_data)
df_LA = pd.read_json(LA_data)
df_St = pd.read_json(State_data)
df_LA.to_csv(r'./Data/Liquor_Authority_Current_List_of_Active_Licenses_Data.csv',index=None)
df_St.to_csv(r'./Data/State_Liquor_Authority_Data.csv',index=None)


# Read Data to Dataframes for the Schema preparation
liquor_df = pd.read_csv('./Data/Liquor_Authority_Current_List_of_Active_Licenses_Data.csv')
wine_df =  pd.read_csv('./Data/State_Liquor_Authority_Data.csv')
wine_df = wine_df.rename(columns={'wholesaler_name' : 'premise_name'})
list_values = wine_df['premise_name']
list_values = list_values.unique()
liquor_df = liquor_df[liquor_df['premise_name'].isin(list_values)]

license_info_df =liquor_df[['serial_number','license_type_code','license_class_code','certificate_number','premise_name']]
license_info_df = license_info_df.rename(columns={"serial_number":"LICENSE_SERIAL_NUMBER","license_type_code":"LICENSE_TYPE_CODE","license_class_code":"LICENSE_CLASS_CODE","certificate_number":"CERTIFICATE_NUMBER","premise_name":"PREMISE_NAME"},errors="raise")
license_info_df = license_info_df.fillna('')
print(license_info_df.head())

location_info_df =liquor_df[['serial_number','county','premise_name','premise_address','premise_city','premise_state','premise_zip','georeference','zone']]
location_info_df = location_info_df.rename(columns={"serial_number":"LICENSE_SERIAL_NUMBER","county":"COUNTY","premise_name":"PREMISE_NAME","premise_address":"PREMISE_ADDR","premise_city":"CITY_NAME","premise_state":"STATE_NAME","premise_zip":"ZIP","georeference":"GEO_POINT","zone":"ZONE_NAME"})
location_info_df = location_info_df.fillna('')
print(location_info_df.head())

date_info_df =liquor_df[['serial_number','license_issued_date','license_expiration_date','effective_date','original_date']]
date_info_df = date_info_df.rename(columns={"serial_number":"LICENSE_SERIAL_NUMBER","license_issued_date":"LICENSE_ISSUED_DATE","license_expiration_date":"LICENSE_EXPIRY_DATE","effective_date":"RECENT_STARTDATE_LICENSE","original_date":"ORIGINAL_DATE"},errors="raise")
date_info_df = date_info_df.fillna("01/01/1900") #defined as null date
print(date_info_df.head())

operation_info_df =liquor_df[['serial_number','days_hours_of_operation','method_of_operation','dba','other']]
operation_info_df = operation_info_df.rename(columns={"serial_number":"LICENSE_SERIAL_NUMBER","days_hours_of_operation":"INFO_DESC","method_of_operation":"METHOD_OF_OPERATION","dba":"DBA","other":"OTHER_INFO"},errors="raise")
operation_info_df = operation_info_df.fillna('')
print(operation_info_df.head())

conn = psycopg2.connect("host ='localhost' dbname='liquorstore' user='johndoe' password= 'johndoe'")
cur = conn.cursor()
conn.autocommit = True

def read_df(df,table,cur):
    if len(df)>0:
        df_column = list(df)
        column = ",".join(df_column) #create columns
        values = "VALUES({})".format(",".join(["%s"for _ in df_column])) #create values (%s ,%s)
        insert_stmt = "INSERT INTO {} ({}) {}".format(table,column,values)
        #cur.execute("truncate "+table+";") #avoid duplicates
        cur=conn.cursor()
        psycopg2.extras.execute_batch(cur,insert_stmt,df.values)
    conn.commit()

schema_path = './schema.sql'

def createTables(cursor):
    with open(schema_path,'r') as schema_data:
        schema_queries = schema_data.read();
        print(schema_queries)
        cursor.execute(schema_queries)
    
# Creating schema and sending the table to postgresql
with conn.cursor() as cursor:
    createTables(cursor)

read_df(license_info_df,'projectdb.licenseinfo',cur)
read_df(location_info_df,'projectdb.locationinfo',cur)
read_df(date_info_df,'projectdb.dateinfo',cur)
read_df(operation_info_df,'projectdb.operationinfo',cur)

cur.close()
conn.close()