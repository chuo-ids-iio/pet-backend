[![CI](https://github.com/chuo-u-ids-iio/pet-backend/actions/workflows/ci.yaml/badge.svg)](https://github.com/chuo-u-ids-iio/pet-backend/actions/workflows/ci.yaml) [![Release Production](https://github.com/chuo-u-ids-iio/pet-backend/actions/workflows/release-deploy.yaml/badge.svg)](https://github.com/chuo-u-ids-iio/pet-backend/actions/workflows/release-deploy.yaml)


# PETバックエンド部分

## 構成
### 実行環境について
スクリプト群はCloudflare Workersで動かす。所謂edge環境。

DBにはCloudflare D1を採用する。中身的にはSQLite。D1の操作はPrismaによって行う。

### 別ファイルになっている資料
- DB設計 [docs/ERD.md](docs/ERD.md)

## デプロイ
デプロイについては [docs/deployment.md] を参照。原則CIツールが自動で流し込みます。
