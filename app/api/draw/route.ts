import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  const expected = process.env.DRAW_ADMIN_TOKEN;
  const supplied = request.headers.get('x-draw-admin-token');
  if (!expected || !supplied || supplied !== expected) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  try {
    const body = await request.json().catch(() => ({}));
    const title = typeof body.title === 'string' ? body.title : 'Sorteio do Clube';
    const drawDate = typeof body.drawDate === 'string' ? body.drawDate : new Date().toISOString();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc('create_and_pick_draw', {
      p_title: title,
      p_draw_date: drawDate,
    });

    if (error) throw error;
    return NextResponse.json({ draw: data?.[0] ?? null });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Não foi possível realizar o sorteio.' }, { status: 500 });
  }
}
