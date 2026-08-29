import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

load_dotenv()


def get_db_connection(include_db=True):
    args = {
        "host": os.getenv("MYSQL_HOST", "localhost"),
        "port": int(os.getenv("MYSQL_PORT", "3306")),
        "user": os.getenv("MYSQL_USER", "root"),
        "password": os.getenv("MYSQL_PASSWORD", ""),
        "autocommit": True,
    }
    if include_db:
        args["database"] = os.getenv("MYSQL_DB", "supplyiq")

    # Optional TLS configuration for managed MySQL providers.
    ssl_ca = os.getenv("MYSQL_SSL_CA")
    if ssl_ca:
        args["ssl_ca"] = ssl_ca
        args["ssl_verify_cert"] = os.getenv("MYSQL_SSL_VERIFY", "true").lower() == "true"

    return mysql.connector.connect(**args)


def init_db(schema_file=None):
    if schema_file is None:
        schema_file = os.path.join(os.path.dirname(__file__), "schema.sql")

    try:
        connection = get_db_connection(include_db=False)
        cursor = connection.cursor()
        with open(schema_file, "r", encoding="utf-8") as schema:
            statements = [stmt.strip() for stmt in schema.read().split(";") if stmt.strip()]
        for statement in statements:
            cursor.execute(statement)
        cursor.close()
        connection.close()
        return True
    except (Error, OSError) as exc:
        print(f"Database initialization failed: {exc}")
        return False


if __name__ == "__main__":
    init_db()
