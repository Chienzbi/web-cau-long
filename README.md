# Cúp cầu lông ao làng

Trang web một file (`index.html`) để bốc thăm ghép đội, xếp lịch vòng tròn, nhập tỷ số 2 set và xem bảng xếp hạng. Dữ liệu lưu trong trình duyệt (localStorage), không cần máy chủ.

## CI/CD

Workflow `.github/workflows/ci-cd.yml`:

| Sự kiện | Việc chạy |
|---|---|
| Pull request vào `main` | Kiểm tra (`scripts/check.js`) và đóng gói |
| Push vào `main` | Kiểm tra, đóng gói, rồi triển khai lên GitHub Pages |

Bật Pages một lần: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Theo dõi công khai và cập nhật dữ liệu

- Ai mở https://chienzbi.github.io/web-cau-long/ đều **chỉ xem** dữ liệu trong `data.json` (đội, lịch, kết quả, bảng xếp hạng). Trang tự tải lại dữ liệu mỗi phút.
- BTC nhập liệu trên máy: mở `index.html` trực tiếp từ ổ đĩa, hoặc thêm `?edit` vào địa chỉ web.
- Cập nhật tự động: nút **🌐 Đăng lên web** (và mỗi lần **Tạo lịch thi đấu**) ghi dữ liệu hiện tại vào `data.json` trên GitHub, CI tự triển khai lại sau khoảng 1–2 phút. Lần đầu cần dán token: tạo tại https://github.com/settings/personal-access-tokens/new (Fine-grained, chỉ chọn repo này, quyền **Contents: Read and write**). Token chỉ lưu trong trình duyệt của BTC.
- Cập nhật thủ công: bấm **Sao lưu**, đổi tên file tải về thành `data.json`, thay vào repo rồi push vào `main`.

## Dùng trên điện thoại

- Giao diện tự co theo màn hình: thanh tab nằm dưới đáy, bảng xếp hạng rút gọn cột.
- Cài lên màn hình chính: Android (Chrome) menu ⋮ → **Cài đặt ứng dụng** / **Thêm vào màn hình chính**; iPhone (Safari) nút Chia sẻ → **Thêm vào Màn hình chính**.
- Nhập liệu trên điện thoại: mở `https://chienzbi.github.io/web-cau-long/?edit` một lần, máy sẽ nhớ chế độ chỉnh sửa (dùng `?view` hoặc nút **Xem như khách** để quay lại chế độ xem). Lần đầu máy tự lấy dữ liệu đang đăng trên web; nút **Lấy từ web** lấy lại bất cứ lúc nào. Dữ liệu chỉnh sửa lưu trong trình duyệt của máy đó.

Chạy kiểm tra trên máy: `node scripts/check.js`
