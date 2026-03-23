# Japan Bikeshare Station Data

日本のシェアサイクルサービスのステーション情報を自動収集・公開するリポジトリです。

データは [公共交通オープンデータセンター (ODPT)](https://api-public.odpt.org/) の GBFS API から取得しており、約2週間に1回 GitHub Actions により自動更新されます。

## データ

`data/` ディレクトリに CSV と GeoJSON 形式で保存されています。

| ファイル名 | サービス | ステーション数（目安） |
|---|---|---|
| `docomo_cycle_station` | ドコモ・バイクシェア | 約 5,744 |
| `hellocycling_station` | ハローサイクリング | 約 13,736 |

### カラム

#### ドコモ・バイクシェア

| カラム | 説明 |
|---|---|
| `station_id` | ステーション ID |
| `name` | ステーション名 |
| `lat` | 緯度 |
| `lon` | 経度 |
| `capacity` | 駐輪可能台数 |
| `region_id` | 地域 ID |

#### ハローサイクリング

| カラム | 説明 |
|---|---|
| `station_id` | ステーション ID |
| `name` | ステーション名 |
| `lat` | 緯度 |
| `lon` | 経度 |
| `address` | 住所 |
| `rental_uris.web` | 予約 URL |
| `parking_hoop` | フープの有無 |
| `parking_type` | 駐輪タイプ |
| `contact_phone` | 連絡先電話番号 |
| `vehicle_capacity` | 車両収容台数 |
| `is_charging_station` | 充電対応の有無 |

## 更新スケジュール

GitHub Actions により **毎月1日・15日 (UTC 0:00)** に自動取得・コミットされます。手動実行も可能です。

## ローカルでの実行

Node.js 18 以上が必要です。

```bash
npm run fetch
```

`data/` ディレクトリに CSV・GeoJSON ファイルが生成されます。

## データソース

| サービス | GBFS エンドポイント |
|---|---|
| ドコモ・バイクシェア | `https://api-public.odpt.org/api/v4/gbfs/docomo-cycle/station_information.json` |
| ハローサイクリング | `https://api-public.odpt.org/api/v4/gbfs/hellocycling/station_information.json` |

## ライセンス

取得データは公共交通オープンデータセンターの利用規約に従ってください。
