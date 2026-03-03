use crate::{RedisPool, settings::Settings};

#[derive(Clone)]
pub struct AppState {
    pub redis_pool: RedisPool,
    pub settings: Settings,
}

impl AppState {
    pub async fn new(redis_pool: RedisPool, settings: Settings) -> Self {
        Self {
            redis_pool,
            settings,
        }
    }
}
