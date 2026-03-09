mod api;
mod app_state;
mod crates;
mod settings;

use crate::{api::routers::ws_handler, crates::session, settings::Settings};
use app_state::AppState;
use axum::{Router, routing::get};
use dotenvy::dotenv;
use tokio::net::TcpListener;

type RedisPool = bb8::Pool<bb8_redis::RedisConnectionManager>;

#[tokio::main]
async fn main() {
    dotenv().ok();
    println!(
        "DEBUG: SIGNAL_REDIS_URL = {:?}",
        std::env::var("SIGNAL_REDIS_URL")
    );
    tracing_subscriber::fmt::init();

    let settings = Settings::new().expect("🚀 설정 파일 로드에 실패했습니다.");

    println!("🚀 Starting server with settings: {:?}", settings);

    let pool = session::create_pool(&settings.redis_url)
        .await
        .expect("🚀 Redis 연결이 실패했습니다.");

    let state = AppState::new(pool, settings.clone()).await;

    let app = Router::new()
        .route("/ws", get(ws_handler))
        .with_state(state);

    let listener = TcpListener::bind("0.0.0.0:9090").await.unwrap();

    println!("🚀 시그널링 서버가 포트:9090 에서 실행 중 입니다.");

    axum::serve(listener, app).await.unwrap();
}
