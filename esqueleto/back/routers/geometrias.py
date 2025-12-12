from fastapi import APIRouter, Response
from sqlalchemy import  create_engine, text
from sqlalchemy_utils import database_exists, create_database
import geopandas as gpd

#Configuring the route (http://localhost:8000/geoms)
router = APIRouter(prefix="/geoms", 
                    responses={404: {"message":"Error in my geoms"}})

#Connecting the databse
engine = create_engine('postgresql://postgres:postgres@localhost:5432/postgres')
conn = engine.connect()

if not database_exists(engine.url):
    create_database(engine.url)

#Defining what happens when you request http://localhost:8000/geoms
@router.get("/vacas_dentro")
async def geoms(): 
    sql = "SELECT vacas_dentro.geom, vacas_dentro.\"deviceName\" FROM vacas_dentro"
    geodf = gpd.read_postgis(text(sql), conn) 
    json_str = geodf.to_json() 
    return Response(content=json_str, media_type='application/json')

@router.get("/vacas_fuera")
async def geoms(): 
    sql = "SELECT vacas_fuera.geom, vacas_fuera.\"deviceName\" FROM vacas_fuera"
    geodf = gpd.read_postgis(text(sql), conn) 
    json_str = geodf.to_json() 
    return Response(content=json_str, media_type='application/json')

@router.get("/vacas_dentro_buffer")
async def geoms():
    sql = 'SELECT vacas_dentro_buffer.geom, vacas_dentro_buffer."deviceName" FROM vacas_dentro_buffer'
    geodf = gpd.read_postgis(text(sql), conn)
    json_str = geodf.to_json()
    return Response(content=json_str, media_type='application/json')

@router.get("/vacas_fuera_buffer")
async def geoms():
    sql = 'SELECT vacas_fuera_buffer.geom, vacas_fuera_buffer."deviceName" FROM vacas_fuera_buffer'
    geodf = gpd.read_postgis(text(sql), conn)
    json_str = geodf.to_json()
    return Response(content=json_str, media_type='application/json')