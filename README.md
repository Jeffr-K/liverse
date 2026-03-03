# Liverse

## Background

최근 K-Beauty 및 K-Fashion의 글로벌 수요 급증으로 국내 브랜드의 해외 라이브 커머스 진출이 가속화되고 있습니다. 그러나 기존의 글로벌 라이브 커머스 시장은 다음과 같은 고비용·저효율의 구조적 한계에 직면해 있습니다.

##### 높은 운영 비용

현지 인플루언서 섭외 및 전문 통역 인력 배치로 인해 단일 라이브 방송당 막대한 초기 자본이 소요됩니다.

##### 사용자 몰입도 저하

텍스트 자막 기반의 번역은 실시간 소통이 핵심인 라이브 환경에서 시청자의 시각적 분산을 초래하며, 호스트의 감정 전달에 한계가 있습니다.

##### 플랫폼 확장성 부재

각 국가별 커머스 플랫폼(TikTok, Amazon, Shopee 등)의 API 규격이 상이하여 다국어 동시 송출 및 통합 관리가 어렵습니다.

`Liverse` 는 이러한 문제를 해결하기 위해 *Real-time AI Media Pipeline* 을 구축하였습니다.

300ms 미만의 초저지연(Ultra-low Latency) 환경에서 음성 인식(STT), 신경망 번역(NMT), 감정 기반 음성 합성(TTS), 그리고 AI 립싱크 기술을 통합하여,

호스트의 언어 장벽을 허물고 글로벌 시장으로의 즉각적인 확장을 가능케 하는 차세대 라이브 커머스 솔루션을 지향합니다.

## Stacks

- Frontend: TypeScript, React, Next.js
- Backend: Rust, tokio, axum, tonic(grpc), sqlx, postgresql
- AI/Media: Python, FFmpeg, gRPC
- Environment & Build: Nix, Flakes
- infrastructure: Kubernetes, Helm, ArgoCD, GoCD, Prometheus, Grafana, Jaeger, toki, Open Telemetry, Istio
- CI/CD: Github Action

## Infrastructure

##
