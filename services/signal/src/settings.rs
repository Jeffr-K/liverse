use config::{Config, ConfigError, Environment, File};
use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct Settings {
    pub redis_url: String,
    pub server_port: u16,
    pub log_level: String,
}

impl Settings {
    pub fn new() -> Result<Self, ConfigError> {
        let s = Config::builder()
            .set_default("server_port", 9090)?
            .set_default("log_level", "info")?
            .add_source(File::with_name(".env").required(false))
            .add_source(Environment::with_prefix("SIGNAL").separator("_"))
            .build()?;

        s.try_deserialize()
    }
}
