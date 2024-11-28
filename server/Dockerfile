FROM python:3.11

WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app
COPY . /app/

# Ensure templates are correctly copied
COPY ./app/utils/email/templates /app/utils/email/templates

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
