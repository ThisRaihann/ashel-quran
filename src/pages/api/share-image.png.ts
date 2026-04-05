import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';

export const GET: APIRoute = async ({ url }) => {
  try {
    // 1. Ambil & Decode Parameter
    const surah = decodeURIComponent(url.searchParams.get('surah') || 'QS. Al-Quran');
    let arabic = decodeURIComponent(url.searchParams.get('arabic') || '');
    let indo = decodeURIComponent(url.searchParams.get('indo') || '');
    let ashel = decodeURIComponent(url.searchParams.get('ashel') || '');

    // Fallback jika kosong
    if (!arabic || arabic.trim() === '') arabic = '—';
    if (!indo || indo.trim() === '') indo = '—';
    if (!ashel || ashel.trim() === '') ashel = '—';

    // 2. Load Fonts (Pake nama file KECIL SEMUA)
    const arabicPath = path.join(process.cwd(), 'src', 'fonts', 'Scheherazade_New', 'ScheherazadeNew-Bold.ttf');
    const latinPath = path.join(process.cwd(), 'src', 'fonts', 'EB_Garamond', 'static', 'EBGaramond-Regular.ttf');

    if (!fs.existsSync(arabicPath) || !fs.existsSync(latinPath)) {
      throw new Error("File font tidak ditemukan! Cek folder src/fonts/");
    }

    const arabicData = fs.readFileSync(arabicPath);
    const latinData = fs.readFileSync(latinPath);

    // 3. Render SVG dengan Satori
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            width: '1200px',
            height: '630px',
            padding: '80px',
            background: '#080d0b',
            color: '#e8dcc8',
            fontFamily: 'LatinFont',
            position: 'relative',
          },
          children: [
            // Header ASHEL
            {
              type: 'div',
              props: {
                style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' },
                children: [
                  { type: 'div', props: { style: { fontSize: '32px', fontWeight: 'bold', color: '#b49146', letterSpacing: '4px' }, children: 'ASHEL' } },
                  { type: 'div', props: { style: { fontSize: '18px', color: '#555', textTransform: 'uppercase' }, children: "Cahaya Al-Qur'an Harimu" } },
                ],
              },
            },
            // Teks Arab
            {
              type: 'div',
              props: {
                style: { display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: '40px' },
                children: [
                  {
                    type: 'p',
                    props: {
                      style: {
                        fontFamily: 'ArabicFont',
                        fontSize: '52px',
                        textAlign: 'right',
                        lineHeight: '1.4',
                        color: '#fff',
                        direction: 'rtl',
                      },
                      children: arabic,
                    },
                  }
                ]
              }
            },
            // Terjemah & Nama Surah
            {
              type: 'div',
              props: {
                style: { display: 'flex', flexDirection: 'column', borderLeft: '5px solid rgba(180, 145, 70, 0.4)', paddingLeft: '35px', marginBottom: '40px' },
                children: [
                  { type: 'p', props: { style: { fontSize: '26px', fontStyle: 'italic', color: '#c8bba8', marginBottom: '10px' }, children: `"${indo}"` } },
                  { type: 'p', props: { style: { fontSize: '18px', color: '#b49146', fontWeight: 'bold' }, children: surah } },
                ]
              }
            },
            // Catatan Ashel (Box Bawah)
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: 'auto',
                  padding: '30px',
                  background: 'rgba(16, 74, 48, 0.2)',
                  borderRadius: '25px',
                  border: '1px solid rgba(16, 74, 48, 0.4)',
                },
                children: [
                  { type: 'p', props: { style: { fontSize: '14px', color: '#4ade80', fontWeight: 'bold', marginBottom: '10px' }, children: 'NOTES ASHEL:' } },
                  { type: 'p', props: { style: { fontSize: '20px', lineHeight: '1.6' }, children: `"${ashel}"` } },
                ],
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: 'ArabicFont', data: arabicData, weight: 400, style: 'normal' },
          { name: 'LatinFont', data: latinData, weight: 400, style: 'normal' },
        ],
      }
    );

    // 4. Konversi SVG ke PNG
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
    const pngBuffer = resvg.render().asPng();

    // 5. Response
    return new Response(Buffer.from(pngBuffer), {
      headers: { 
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
    });

  } catch (error: any) {
    console.error("DEBUG ERROR:", error.message);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
};