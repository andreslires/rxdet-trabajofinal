import pandas as pd

# Cargar el conjunto de datos cows_pos.csv
cows_df = pd.read_csv('./archivos/cows_pos.csv')

# Quedarnos solo con los datos entre el 20 y el 25 de abril de 2023
# Formato YYYY-MM-DD HH:MM:SS.sssssssss+00:00
cows_df['time'] = pd.to_datetime(cows_df['time'])

# Fechas de inicio y fin
fecha_inicio = pd.Timestamp('2023-04-20', tz='UTC')
fecha_fin = pd.Timestamp('2023-04-26', tz='UTC')

# Filtrar el DataFrame
cows_df = cows_df[(cows_df['time'] >= fecha_inicio) & (cows_df['time'] < fecha_fin)]

# Imprimir el DataFrame resultante
print(f"Datos de vacas entre {fecha_inicio.date()} y {fecha_fin.date()}:")
print(cows_df)

# Limpiar y estandarizar esos datos, si es necesario


# Guardar el DataFrame filtrado en un nuevo archivo CSV
cows_df.to_csv('./archivos/cows_pos_filtered.csv', index=False)