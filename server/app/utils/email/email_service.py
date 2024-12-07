import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Load email configuration from environment variables
EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = os.getenv("EMAIL_PORT")
EMAIL_USERNAME = os.getenv("EMAIL_USERNAME")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
EMAIL_FROM = os.getenv("EMAIL_FROM")

CLIENT_URL = os.getenv("CLIENT_URL")

# Function to load the HTML template from the templates folder
def load_html_template(file_path):
    """Loads HTML content from a file."""
    # Define the absolute path to the templates folder inside the container
    templates_dir = "/app/utils/email/templates"
    full_path = os.path.join(templates_dir, file_path)

    try:
        with open(full_path, 'r') as file:
            return file.read()
    except FileNotFoundError:
        print(f"Error: The file at {full_path} was not found.")
        raise
    except Exception as e:
        print(f"An error occurred while loading the template: {e}")
        raise

def send_subscription_email(recipient: str):
    """Function to send the email."""
    # Create the email content
    message = MIMEMultipart("alternative")
    message["From"] = EMAIL_FROM
    message["To"] = recipient
    message["Subject"] = "Welcome to MediFind Newsletter!"

    try:
        # Load HTML content from the external file in templates folder
        html_body = load_html_template("subscribe_template.html")
        
        # Construct dynamic URLs
        unsubscribe_url = f"{CLIENT_URL}/newsletter/unsubscribe?email={recipient}"
        client_url = CLIENT_URL  # The main client link for "Explore Now"
        
        # Replace placeholders in the template with actual URLs
        html_body = html_body.replace("{{unsubscribe_url}}", unsubscribe_url)
        html_body = html_body.replace("{{client_url}}", client_url)
    except Exception as e:
        print(f"Failed to load HTML template: {e}")
        return

    # Attach the HTML part
    message.attach(MIMEText(html_body, "html"))

    try:
        # Set up the SMTP server and send the email
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.ehlo()  # Identify ourselves to the server
            server.starttls()  # Secure the connection
            server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
            server.sendmail(EMAIL_FROM, recipient, message.as_string())
            print("Email sent successfully.")
    except smtplib.SMTPException as e:
        print(f"SMTP error occurred: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

def send_notification_email(recipient: str, post_id: str):
    """Function to send the email."""
    # Create the email content
    message = MIMEMultipart("alternative")
    message["From"] = EMAIL_FROM
    message["To"] = recipient
    message["Subject"] = "New response on your post!"

    try:
        # Load HTML content from the external file in templates folder
        html_body = load_html_template("comment_notif.html")
        
        # Replace placeholders in the template with actual values
        post_url = f"{CLIENT_URL}/community/{post_id}"
        html_body = html_body.replace("{{post_url}}", post_url)

    except Exception as e:
        print(f"Failed to load HTML template: {e}")
        return

    # Attach the HTML part
    message.attach(MIMEText(html_body, "html"))

    try:
        # Set up the SMTP server and send the email
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.ehlo()  # Identify ourselves to the server
            server.starttls()  # Secure the connection
            server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
            server.sendmail(EMAIL_FROM, recipient, message.as_string())
            print("Email sent successfully.")
    except smtplib.SMTPException as e:
        print(f"SMTP error occurred: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")