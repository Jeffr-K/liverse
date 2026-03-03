use bb8::Pool;
use bb8_redis::RedisConnectionManager;
use std::error::Error;

pub type RedisPool = Pool<RedisConnectionManager>;

pub async fn create_pool(url: &str) -> Result<RedisPool, Box<dyn Error>> {
    let manager = RedisConnectionManager::new(url)?;

    let pool = Pool::builder().max_size(15).build(manager).await?;

    Ok(pool)
}
