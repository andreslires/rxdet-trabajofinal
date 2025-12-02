-- Vacas que se encuentran dentro de una finca específica

SELECT 
    c.*,
    f.id as finca_id
FROM cows_pos c
INNER JOIN fincas f 
    ON ST_Within(c.geometry, f.geometry);

-- Vacas que se encuentran fuera de una finca específica

-- Alternativa 1:

SELECT 
    c.*
FROM cows_pos c
WHERE NOT EXISTS (
    SELECT 1 
    FROM fincas f 
    WHERE ST_Within(c.geometry, f.geometry));

-- Alternativa 2:

SELECT 
    c.*
FROM cows_pos c
LEFT JOIN fincas f 
    ON ST_Within(c.geometry, f.geometry)
WHERE f.id IS NULL

-- Devuelven el mismo resultado (mismo número de filas) las 2 alternativas en DBeaver