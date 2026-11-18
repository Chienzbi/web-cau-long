# Cúp cầu lông ao làng

Trang web một file (`index.html`) để bốc thăm ghép đội, xếp lịch vòng tròn, nhập tỷ số 2 set và xem bảng xếp hạng. Dữ liệu lưu trong trình duyệt (localStorage), không cần máy chủ.

## CI/CD

Workflow `.github/workflows/ci-cd.yml`:

| Sự kiện | Việc chạy |
|---|---|
| Pull request vào `main` | Kiểm tra (`scripts/check.js`) và đóng gói |
| Push vào `main` | Kiểm tra, đóng gói, rồi triển khai lên GitHub Pages |

Bật Pages một lần: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Chạy kiểm tra trên máy: `node scripts/check.js`
