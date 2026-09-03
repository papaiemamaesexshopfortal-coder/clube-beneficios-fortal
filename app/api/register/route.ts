import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const phone = String(body.phone ?? '').trim();
    const cpf = String(body.cpf ?? '').replace(/\D/g, '');
    const terms = body.terms === 'yes';
    if (name.length < 3 || !email.includes('@') || phone.length < 8 || cpf.length !== 11 || !terms) {
      return NextResponse.json({ error: 'Confira os dados e aceite os termos para continuar.' }, { status: 400 });
    }
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('members').insert({ name, email, phone, cpf, terms_accepted_at: new Date().toISOString() }).select('lucky_number').single();
    if (error) {
      if (error.code === '23505') return NextResponse.json({ error: 'Já existe um cadastro com este CPF ou e-mail.' }, { status: 409 });
      throw error;
    }
    return NextResponse.json({ luckyNumber: String(data.lucky_number).padStart(6, '0') });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Serviço temporariamente indisponível. Tente novamente em instantes.' }, { status: 500 });
  }
}
