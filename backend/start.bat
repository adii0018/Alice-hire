@echo off

echo Starting SecureHire Backend...

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Run migrations
echo Running migrations...
python manage.py makemigrations
python manage.py migrate

REM Start server
echo Starting Daphne server on port 8000...
daphne -b 0.0.0.0 -p 8000 securehire.asgi:application
