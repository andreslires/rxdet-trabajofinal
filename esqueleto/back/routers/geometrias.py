from fastapi import APIRouter, Response
from sqlalchemy import  create_engine, text
from sqlalchemy_utils import database_exists, create_database
import geopandas as gpd

#Configuring the route (http://localhost:8000/geoms)
router = APIRouter(prefix="/geoms", 
                    responses={404: {"message":"Error in my geoms"}})

#Connecting the databse
engine = create_engine('CONNECT TO THE RXDET DATABASE') #!CAMBIAR PARA CONECTAR A LA BASE DE DATOS RXDET
conn = engine.connect()

if not database_exists(engine.url):
    create_database(engine.url)

#Defining what happens when you request http://localhost:8000/geoms
@router.get("/")
async def geoms(): 
    sql = "GIVE ME THE LUGO GEOMETRY IN 4326" #!DEFINIR LA CONSULTA SQL
    geodf = gpd.read_postgis(text(sql), conn) 
    json_str = geodf.to_json() 
    return Response(content=json_str, media_type='application/json')