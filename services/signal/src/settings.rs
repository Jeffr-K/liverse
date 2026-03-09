use config::{Config, ConfigError, Environment, File};
use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct Settings {
    pub redis_url: String,
    pub server_port: u16,
    pub log_level: String,
}

/// config-rs
///
/// ```terminal
/// $ cargo add config
/// ```
/// Set defaults
/// Set explicit values (to programmatically override)
/// Read from JSON, TOML, YAML, INI, RON, JSON5, CORN files
/// Read from environment
/// Loosely typed — Configuration values may be read in any supported type, as long as there exists a reasonable conversion
/// Access nested fields using a formatted path — Uses a subset of JSONPath; currently supports the child ( redis.port ) and subscript operators ( databases[0].name )
impl Settings {
    pub fn new() -> Result<Self, ConfigError> {
        let s = Config::builder()
            .set_default("server_port", 9090)?
            .set_default("log_level", "info")?
            .add_source(File::with_name("Config").required(false))
            .add_source(Environment::with_prefix("SIGNAL").separator("_"))
            .build()?;

        s.try_deserialize()
    }
}
