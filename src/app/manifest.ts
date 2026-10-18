import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Commit 20 — 20 Giờ Để Master 1 Kỹ Năng',
    short_name: 'Commit 20',
    description: 'Nền tảng làm chủ kỹ năng siêu tốc trong <= 20 giờ. Nghiệm thu bằng sản phẩm thực tế.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#fe7141',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
