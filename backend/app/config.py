from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "Plataa Backend"
    database_url: str | None = Field(default=None, env="DATABASE_URL")
    database_host: str = Field("200.144.245.12", env="DATABASE_HOST")
    database_port: int = Field(45432, env="DATABASE_PORT")
    database_user: str = Field("u_grupo05", env="DATABASE_USER")
    database_password: str = Field("grupo05", env="DATABASE_PASSWORD")
    database_name: str = Field("db_grupo05", env="DATABASE_NAME")

    user_schema: str = Field("user_auth", env="USER_SCHEMA")
    specialist_schema: str = Field("specialist_auth", env="SPECIALIST_SCHEMA")
    tests_schema: str = Field("test_data", env="TESTS_SCHEMA")

    jwt_secret_key: str = Field("super-secret-development-key", env="JWT_SECRET_KEY")
    jwt_algorithm: str = Field("HS256", env="JWT_ALGORITHM")
    jwt_expiration_minutes: int = Field(60 * 12, env="JWT_EXPIRATION_MINUTES")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @property
    def base_database_url(self) -> str:
        return (
            f"postgresql+psycopg2://{self.database_user}:{self.database_password}"
            f"@{self.database_host}:{self.database_port}/{self.database_name}"
        )

    @property
    def sqlalchemy_url(self) -> str:
        return self.database_url or self.base_database_url

@lru_cache()
def get_settings() -> Settings:
    return Settings()
