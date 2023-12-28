# Pasos para Configurar y Ejecutar el Servidor con Python Flask

## 1. Navegar a la Ruta Raíz del Proyecto Server
Asegúrate de estar en la ruta ./TradingBot/server antes de realizar cualquier acción.

## 2. Configurar la Ejecución de Scripts
En la terminal de comandos ejecuta el siguiente comando para asegurarte de que la ejecución de scripts esté permitida:

```bash
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 3. Configuración del Entorno Virtual y Librerías
## 3.1. Ejecutar script el cual realiza todos los pasos automáticamente

```bash
.\setup.ps1
```
## 3.2 En vez de ejecutar el script puede ejecutar los pasos manualmente
Puede realizar la misma operación de forma manual ejecutando los siguientes comandos. Primero crear un entorno virtual, luego activarlo y por último instalar las librerias

```bash
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

## 4. Crear el Archivo de Variables de Entorno (Se puede crear el fichero y no asignarle ningúun valor a las variables)
Crea un archivo llamado .env para almacenar las variables de entorno:

Fichero .env
### Variables Binance (Se pueden dejar en blanco las variables)
BINANCE_API_KEY = tu_api_key  
BINANCE_SECRET_KEY = tu_clave_secreta  

## 5. Ejecutar el Proyecto del Servidor
Finalmente, ejecuta el siguiente comando para iniciar el servidor Flask:

```bash
flask --app app --debug run
```
