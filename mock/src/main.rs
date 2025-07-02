use axum::{
    Router,
    http::{HeaderMap, StatusCode},
    response::Json,
    routing::{delete, get, post},
};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct TokenRequest {
    #[serde(rename = "jwt")]
    _jwt: String,
}

const TOKEN: &str = "mock-token";

#[derive(Serialize)]
struct TokenResponse {
    token: String,
}

#[tokio::main]
async fn main() {
    let tokens_endpoint = "/api/v1/trusted_publishing/tokens";
    let app = Router::new()
        .route(tokens_endpoint, post(get_token))
        .route(tokens_endpoint, delete(revoke_token))
        .route("/health", get(health));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    println!("Server running on http://0.0.0.0:3000");
    axum::serve(listener, app).await.unwrap();
}

async fn get_token(Json(_payload): Json<TokenRequest>) -> Result<Json<TokenResponse>, StatusCode> {
    let response = TokenResponse {
        token: TOKEN.to_string(),
    };
    Ok(Json(response))
}

async fn revoke_token(headers: HeaderMap) -> Result<StatusCode, StatusCode> {
    match headers.get("authorization") {
        Some(auth_header) => {
            if auth_header == &format!("Bearer {TOKEN}") {
                Ok(StatusCode::NO_CONTENT)
            } else {
                Err(StatusCode::UNAUTHORIZED)
            }
        }
        None => Err(StatusCode::UNAUTHORIZED),
    }
}

async fn health() -> Result<(), StatusCode> {
    Ok(())
}
