select * from cows_pos cp;

select * from fincas f;

-- Vista 1: Vacas dentro de fincas
CREATE OR REPLACE VIEW vacas_dentro AS
SELECT 
    v.*
FROM cows_pos v
INNER JOIN fincas f 
    ON ST_Within(v.geometry, f.geometry);

select * from vacas_dentro;
select count(*) from vacas_dentro;

-- Vista 2: Vacas fuera de fincas  
CREATE OR REPLACE VIEW vacas_fuera AS
SELECT 
    v.*,
FROM cows_pos v
WHERE NOT EXISTS (
    SELECT 1 FROM fincas f 
    WHERE ST_Within(v.geometry, f.geometry)
);

select * from vacas_fuera;
select count(*) from vacas_fuera;