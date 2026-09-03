import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  const expected = process.env.DRAW_ADMIN_TOKEN;
  const supplied = request.headers.get('x-draw-admin-token');
  if (!expected || !supplied || supplied !== expected) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  try {
    const { title = 'Sorteio do Clube', drawDate = new Date().toISOString() } = await request.json().catch(() => ({}));
    const supabase = getSupabaseAdmin();
    const { data: draw, error: createError } = await supabase.from('draws').insert({ title, draw_date: drawDate }).select('id').single();
    if (createError) throw createError;
    const { data: winner, error: winnerError } = await supabase.rpc('pick_draw_winner', { p_draw_id: draw.id });
    if (winnerError) throw winnerError;
    return NextResponse.json({ draw: winner });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Não foi possível realizar o sorteio.' }, { status: 500 });
  }
}
