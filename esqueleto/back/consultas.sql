select * from cows_pos cp;

select * from fincas f;

-- Vista 1: Vacas dentro de fincas
CREATE OR REPLACE VIEW vacas_dentro AS
SELECT 
    v.time,
    v."deviceName",
    v.geometry as geom
FROM cows_pos v
INNER JOIN fincas f 
    ON ST_Within(v.geometry, f.geometry);

select * from vacas_dentro;
select count(*) from vacas_dentro; -- 734

-- Vista 2: Vacas fuera de fincas  
CREATE OR REPLACE VIEW vacas_fuera AS
SELECT 
    v.time,
    v."deviceName",
    v.geometry as geom
FROM cows_pos v
WHERE NOT EXISTS (
    SELECT * FROM fincas f 
    WHERE ST_Within(v.geometry, f.geometry)
);

select * from vacas_fuera;
select count(*) from vacas_fuera; -- 105

-- Con el objetivo de eliminar falsos positivos del resultado mostrado al cliente, sería
-- conveniente no tener en cuenta las posiciones de los animales que estén a menos de 15 metros de
-- una finca.

-- Vista 3: Vacas fuera de fincas, considerando un buffer de 15 metros
CREATE OR REPLACE VIEW vacas_fuera_buffer AS
SELECT 
    v.time,
    v."deviceName",
    v.geometry as geom
FROM cows_pos v
WHERE NOT EXISTS (
    SELECT * FROM fincas f 
    WHERE ST_DWithin(ST_Transform(v.geometry, 25829), 
                     ST_Transform(f.geometry, 25829), 
                     15)
);

select * from vacas_fuera_buffer;
select count(*) from vacas_fuera_buffer; -- 59

-- Vista 4: Vacas dentro de fincas, considerando un buffer de 15 metros
CREATE OR REPLACE VIEW vacas_dentro_buffer AS
SELECT 
    v.time,
    v."deviceName",
    v.geometry as geom
FROM cows_pos v
INNER JOIN fincas f 
    ON ST_DWithin(ST_Transform(v.geometry, 25829), 
                  ST_Transform(f.geometry, 25829), 
                  15);

select * from vacas_dentro_buffer;
select count(*) from vacas_dentro_buffer; -- 823


-- Eliminar las vistas (si es necesario por algún motivo)
drop view vacas_dentro;
drop view vacas_fuera;
drop view vacas_fuera_buffer;
drop view vacas_dentro_buffer;